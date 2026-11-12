import math

from geom import *
from params import *

LOW = (V, H)
UPP = (VC, HC)
FIGURE = (VF, HF)
SMALL = (VS, HS)


def ess(y0, y1, lean=-0.025, stretch=1.15, ru=0.225, rl=0.24, arm=28, pen=LOW):
    """S-shaped stroke between centre-line heights y0 and y1: two round bowls (the upper one smaller) joined by a
    straight spine tangent to both, their open arms reaching as wide as the bowls. Built from circles, then
    widened by `stretch`; `lean` shifts the lower bowl sideways (as a fraction of the height)"""
    bh = y1 - y0
    ru, rl = ru * bh, rl * bh
    cu, cl = (0, bh - ru), (lean * bh, rl)
    d, sr = math.hypot(cl[0] - cu[0], cl[1] - cu[1]), ru + rl
    u = math.atan2(cl[1] - cu[1], cl[0] - cu[0]) + math.atan2(sr, math.sqrt(d * d - sr * sr))
    nx, ny = -math.sin(u), math.cos(u)
    deg = math.degrees(u)
    p2 = (cl[0] + rl * nx, cl[1] + rl * ny)
    sk = (Skel(*on_ellipse(cu[0], cu[1], ru, ru, arm)).arc(cu[0], cu[1], ru, ru, arm, deg + 270)
          .L(*p2).arc(cl[0], cl[1], rl, rl, deg + 90, -180 + arm))
    return sk.mapped(lambda p: (stretch * p[0], y0 + p[1])).stroke(pen[0], pen[1] / pen[0])


def vee(w, top, bottom, flat=FLAT, pen=LOW):
    """two strokes meeting in a point: w wide at `top`, a vertex with a small flat at `bottom`"""
    xm = w / 2
    hw = slant_width(xm - flat / 2, abs(top - bottom), *pen)
    yi = bottom + (top - bottom) * (hw - flat / 2) / (xm - flat / 2)
    return poly((0, top), (hw, top), (xm, yi), (w - hw, top), (w, top), (xm + flat / 2, bottom), (xm - flat / 2, bottom))


def zigzag(w, top, bottom, flat=FLAT, pen=LOW):
    """four strokes of equal slope (w, W): outer ends at `top`, two vertices at `bottom`, the middle one at `top`"""
    hw = pen[0]
    for _ in range(6):
        xb = w / 4 - flat / 4 + hw / 2
        hw = slant_width(xb - flat / 2, abs(top - bottom), *pen)
    s = (xb - flat / 2) / (top - bottom)
    inner = meet((hw, top), (hw + s, top - 1), (w / 2 - flat / 2, top), (w / 2 - flat / 2 - s, top - 1))
    crotch = meet((xb + flat / 2, bottom), (xb + flat / 2 + s, bottom + 1), (w - xb - flat / 2, bottom), (w - xb - flat / 2 - s, bottom + 1))
    return poly((0, top), (hw, top), inner, (w / 2 - flat / 2, top), (w / 2 + flat / 2, top), (w - inner[0], inner[1]),
                (w - hw, top), (w, top), (w - xb + flat / 2, bottom), (w - xb - flat / 2, bottom), crotch,
                (xb + flat / 2, bottom), (xb - flat / 2, bottom))


def cross(top0, top1, bot0, bot1, y0, y1, pen=LOW):
    """two strokes crossing: outline spans top0..top1 at y1 and bot0..bot1 at y0"""
    hw = pen[0]
    for _ in range(6):
        hw = slant_width(top1 - hw - bot0, y1 - y0, *pen)
    a = poly((bot0, y0), (bot0 + hw, y0), (top1, y1), (top1 - hw, y1))
    hw2 = pen[0]
    for _ in range(6):
        hw2 = slant_width(bot1 - hw2 - top0, y1 - y0, *pen)
    b = poly((top0, y1), (top0 + hw2, y1), (bot1, y0), (bot1 - hw2, y0))
    return a | b




def zed(w, top, inset, short, pen=LOW):
    """two bars joined by a diagonal; the top bar starts `inset` in, the bottom bar stops `short` early"""
    hw = pen[0]
    for _ in range(6):
        hw = slant_width(w - hw, top, *pen)
    s = (w - hw) / top
    t = pen[1]
    return poly((inset, top), (w, top), (w - s * (top - t), t), (w - short, t), (w - short, 0), (0, 0),
                (s * (top - t), top - t), (inset, top - t))


def tangent_angle(p, cx, cy, rx, ry, lo, hi):
    """parameter angle (degrees, between lo and hi) at which the tangent to the ellipse passes through p"""
    def f(a):
        t = math.radians(a)
        ex, ey = cx + rx * math.cos(t), cy + ry * math.sin(t)
        return (p[0] - ex) * (ry * math.cos(t)) - (p[1] - ey) * (-rx * math.sin(t))
    flo = f(lo)
    for _ in range(60):
        mid = (lo + hi) / 2
        if (f(mid) > 0) == (flo > 0):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2
