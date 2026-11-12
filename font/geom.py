import math

import pathops
from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen

from params import H, HR, KO, V, VR

K = 0.5522847498


class Shape:
    """filled area: a list of closed contours made of lines and cubic curves"""

    def __init__(self, contours=None):
        self.contours = contours or []

    def _path(self):
        p = pathops.Path()
        for c in self.contours:
            for s in c:
                if s[0] == "M":
                    p.moveTo(*s[1])
                elif s[0] == "L":
                    p.lineTo(*s[1])
                else:
                    p.cubicTo(*s[1], *s[2], *s[3])
            p.close()
        return p

    @staticmethod
    def _from_path(p):
        out, cur, last = [], None, None
        for verb, pts in p.segments:
            if verb == "moveTo":
                cur = [("M", pts[0])]
                out.append(cur)
            elif verb == "lineTo":
                cur.append(("L", pts[0]))
            elif verb == "curveTo":
                cur.append(("C", pts[0], pts[1], pts[2]))
            elif verb == "qCurveTo":
                for q, e in pathops.decompose_quadratic_segment(pts):
                    cur.append(("C", (last[0] + (q[0] - last[0]) * 2 / 3, last[1] + (q[1] - last[1]) * 2 / 3),
                                (e[0] + (q[0] - e[0]) * 2 / 3, e[1] + (q[1] - e[1]) * 2 / 3), e))
                    last = e
            if pts:
                last = pts[-1]
        return Shape([c for c in out if len(c) > 2])

    def _op(self, other, kind):
        return Shape._from_path(pathops.op(self._path(), other._path(), kind, fix_winding=True, clockwise=True))

    def __or__(self, other):
        return self._op(other, pathops.PathOp.UNION)

    def __sub__(self, other):
        return self._op(other, pathops.PathOp.DIFFERENCE)

    def __and__(self, other):
        return self._op(other, pathops.PathOp.INTERSECTION)

    def tf(self, t):
        return Shape([[(s[0],) + tuple(t.transformPoint(p) for p in s[1:]) for s in c] for c in self.contours])

    def move(self, dx=0, dy=0):
        return self.tf(Transform().translate(dx, dy))

    def scale(self, sx, sy):
        return self.tf(Transform().scale(sx, sy))

    def flipx(self, cx):
        return self.tf(Transform().translate(cx, 0).scale(-1, 1).translate(-cx, 0))

    def flipy(self, cy):
        return self.tf(Transform().translate(0, cy).scale(1, -1).translate(0, -cy))

    def rot(self, deg, about=(0, 0)):
        return self.tf(Transform().translate(*about).rotate(math.radians(deg)).translate(-about[0], -about[1]))

    def band(self, y0, y1):
        return self & rect(-9000, y0, 9000, y1)

    def bounds(self):
        pen = BoundsPen(None)
        for c in self.contours:
            pen.moveTo(c[0][1])
            for s in c[1:]:
                if s[0] == "L":
                    pen.lineTo(s[1])
                else:
                    pen.curveTo(s[1], s[2], s[3])
            pen.closePath()
        return pen.bounds


class _Path:
    def __init__(self, x, y):
        self.c = [("M", (x, y))]
        self.cur = (x, y)

    def L(self, x, y):
        if abs(x - self.cur[0]) > 1e-6 or abs(y - self.cur[1]) > 1e-6:
            self.c.append(("L", (x, y)))
            self.cur = (x, y)
        return self

    def H(self, x):
        return self.L(x, self.cur[1])

    def V(self, y):
        return self.L(self.cur[0], y)

    def C(self, x1, y1, x2, y2, x, y):
        self.c.append(("C", (x1, y1), (x2, y2), (x, y)))
        self.cur = (x, y)
        return self

    def _q(self, corner, p, t0, t1):
        t1 = t0 if t1 is None else t1
        a = self.cur
        return self.C(a[0] + (corner[0] - a[0]) * t0, a[1] + (corner[1] - a[1]) * t0,
                      p[0] + (corner[0] - p[0]) * t1, p[1] + (corner[1] - p[1]) * t1, p[0], p[1])

    def QH(self, x, y, t0=K, t1=None):
        """quarter turn leaving horizontally and arriving vertically; t0, t1 are the curve tensions at each end"""
        return self._q((x, self.cur[1]), (x, y), t0, t1)

    def QV(self, x, y, t0=K, t1=None):
        """quarter turn leaving vertically and arriving horizontally"""
        return self._q((self.cur[0], y), (x, y), t0, t1)

    def G(self, x, y, a0, l0, a1, l1):
        """curve to (x, y) leaving in direction a0 and arriving in direction a1 (degrees), with handle lengths l0, l1"""
        a0, a1 = math.radians(a0), math.radians(a1)
        return self.C(self.cur[0] + l0 * math.cos(a0), self.cur[1] + l0 * math.sin(a0),
                      x - l1 * math.cos(a1), y - l1 * math.sin(a1), x, y)

    def arc(self, cx, cy, rx, ry, a0, a1):
        """elliptical arc from angle a0 to a1 (degrees, counter-clockwise positive)"""
        n = max(1, math.ceil(abs(a1 - a0) / 90 - 1e-9))
        step = math.radians(a1 - a0) / n
        h = 4 / 3 * math.tan(step / 4)
        a = math.radians(a0)
        self.L(cx + rx * math.cos(a), cy + ry * math.sin(a))
        for _ in range(n):
            b = a + step
            p1 = (cx + rx * math.cos(b), cy + ry * math.sin(b))
            self.C(self.cur[0] - h * rx * math.sin(a), self.cur[1] + h * ry * math.cos(a),
                   p1[0] + h * rx * math.sin(b), p1[1] - h * ry * math.cos(b), p1[0], p1[1])
            a = b
        return self


    def mapped(self, fn):
        """the same path with every point passed through fn"""
        out = type(self)(*fn(self.c[0][1]))
        out.c = [(s[0],) + tuple(fn(p) for p in s[1:]) for s in self.c]
        out.cur = out.c[-1][-1]
        return out


def on_ellipse(cx, cy, rx, ry, a):
    return (cx + rx * math.cos(math.radians(a)), cy + ry * math.sin(math.radians(a)))


class Pen(_Path):
    """draws one closed, filled contour"""

    def shape(self):
        return Shape([self.c])


class Skel(_Path):
    """centre line of a stroke, drawn with a pen w wide and w * squash tall"""

    def stroke(self, w=V, squash=H / V, closed=False, join="miter"):
        p = pathops.Path()
        for s in self.c:
            if s[0] == "M":
                p.moveTo(s[1][0], s[1][1] / squash)
            elif s[0] == "L":
                p.lineTo(s[1][0], s[1][1] / squash)
            else:
                p.cubicTo(s[1][0], s[1][1] / squash, s[2][0], s[2][1] / squash, s[3][0], s[3][1] / squash)
        if closed:
            p.close()
        joins = {"miter": pathops.LineJoin.MITER_JOIN, "round": pathops.LineJoin.ROUND_JOIN, "bevel": pathops.LineJoin.BEVEL_JOIN}
        p.stroke(w, pathops.LineCap.BUTT_CAP, joins[join], 20)
        p.simplify(fix_winding=True, clockwise=True)
        return Shape._from_path(p).scale(1, squash)


def poly(*pts):
    return Shape([[("M", pts[0])] + [("L", p) for p in pts[1:]]])


def rect(x0, y0, x1, y1):
    return poly((x0, y0), (x0, y1), (x1, y1), (x1, y0))


def oval(x0, y0, x1, y1, k=KO):
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return Pen(x1, cy).QV(cx, y1, k).QH(x0, cy, k).QV(cx, y0, k).QH(x1, cy, k).shape()


def disc(cx, cy, d):
    return oval(cx - d / 2, cy - d / 2, cx + d / 2, cy + d / 2, K)


def ring(x0, y0, x1, y1, side=VR, top=HR):
    """round stroke filling the box, `side` thick at the flanks and `top` thick at top and bottom"""
    return oval(x0, y0, x1, y1) - oval(x0 + side, y0 + top, x1 - side, y1 - top)


def sector(cx, cy, a0, a1, r=4000):
    """wedge with its apex at (cx, cy) between two directions (degrees, counter-clockwise from a0 to a1)"""
    pts = [(cx, cy)]
    n = max(2, int(abs(a1 - a0) / 30) + 1)
    for i in range(n + 1):
        a = math.radians(a0 + (a1 - a0) * i / n)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return poly(*pts)


def slant_width(dx, dy, w=V, h=H):
    """horizontal width of a straight stroke running dx across for dy up, drawn with a pen w wide and h tall"""
    return math.hypot(w, h * dx / dy)


def bar(x0, y0, x1, y1, w=V, h=H, ext=0):
    """diagonal stroke given by its centre line, cut horizontally at both ends; ext lengthens it past both ends"""
    hw = slant_width(x1 - x0, y1 - y0, w, h) / 2
    if ext:
        s = (x1 - x0) / (y1 - y0)
        d = math.copysign(ext, y1 - y0)
        x0, y0, x1, y1 = x0 - s * d, y0 - d, x1 + s * d, y1 + d
    return poly((x0 - hw, y0), (x0 + hw, y0), (x1 + hw, y1), (x1 - hw, y1))


def meet(p1, p2, p3, p4):
    """intersection of the line through p1, p2 with the line through p3, p4"""
    d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0])
    a = p1[0] * p2[1] - p1[1] * p2[0]
    b = p3[0] * p4[1] - p3[1] * p4[0]
    return ((a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d)
