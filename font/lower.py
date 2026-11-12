import math

from fontbuild import glyph
from forms import *
from geom import *
from params import *

R = (XH + 2 * OVX) / 2
D = 2 * R
CY = XH / 2
TOP = XH + OVX
STEM_SB = 132
HALF_SB = 110
THIN_SB = 110
DOT_Y = ASC + OVX - DOT / 2
N_W = 968
M_W = 1632
BAR_ARM = 200


def bowl(stem=None, left=False, extra=None):
    """the o circle; `stem` (y0, y1) adds a stem tangent to its right side between those heights"""
    body = oval(0, -OVX, D, TOP)
    if stem:
        body = body | rect(D - V, stem[0], D, stem[1])
    if extra is not None:
        body = body | extra
    s = body - oval(VR, -OVX + HR, D - V, TOP - HR)
    return s.flipx(R) if left else s


def tube(w):
    """two legs joined by a half circle: one stroke, w wide, standing on the baseline"""
    r = w / 2
    ys = TOP - r
    return (Pen(0, 0).V(ys).QV(r, TOP, KO).QH(w, ys, KO).V(0).H(w - V).V(ys)
            .QV(r, TOP - HR, KO).QH(V, ys, KO).V(0).shape())


def hook(x, y0, y1, side):
    """stem at x from y0 ending at y1 in a quarter-circle hook towards `side` (+1 right, -1 left)"""
    up = 1 if y1 > y0 else -1
    yc = y1 - up * (H / 2 + HOOK)
    a0, a1 = (180, 180 - 90 * up) if side > 0 else (0, 90 * up)
    return (Skel(x, y0).V(yc).arc(x + side * HOOK, yc, HOOK, HOOK, a0, a1).H(x + side * (HOOK + 20)).stroke())


@glyph("o", RB, RB)
def _():
    return ring(0, -OVX, D, TOP)


@glyph("a", RB, STEM_SB)
def _():
    return bowl((0, XH))


@glyph("d", RB, HALF_SB)
def _():
    return bowl((CY, ASC))


@glyph("q", RB, HALF_SB)
def _():
    return bowl((DESC, CY))


@glyph("b", HALF_SB, RB)
def _():
    return bowl((CY, ASC), left=True)


@glyph("p", HALF_SB, RB)
def _():
    return bowl((DESC, CY), left=True)


@glyph("g", RB, HALF_SB)
def _():
    xs = D - V / 2
    yc = DESC - OVX + H / 2 + HOOK
    tail = Skel(xs, CY).V(yc).arc(xs - HOOK, yc, HOOK, HOOK, 0, -90).H(R).stroke()
    return bowl(extra=tail)


@glyph("c", RB, 56)
def _():
    return ring(0, -OVX, D, TOP) - sector(R, CY, -ARM, ARM)


E_BAR = (505, 505 + H)


@glyph("e", RB, 76)
def _():
    full = oval(0, -OVX, D, TOP)
    a = math.radians(-ARM)
    gap = poly((R, E_BAR[0]), (R + 4000, E_BAR[0]), (R + 4000, CY - 4000),
               (R + 4000 * math.cos(a), CY + 4000 * math.sin(a)), (R, CY))
    return (ring(0, -OVX, D, TOP) - gap) | (rect(VR - 20, E_BAR[0], D, E_BAR[1]) & full)


@glyph("n", 124, 124)
def _():
    return tube(N_W)


@glyph("u", 124, 124)
def _():
    return tube(N_W).rot(180, (N_W / 2, XH / 2))


@glyph("h", 124, 124)
def _():
    return tube(N_W) | rect(0, 0, V, ASC)


@glyph("m", 124, 124)
def _():
    w = (M_W + V) / 2
    return tube(w) | tube(w).move(w - V)


@glyph("r", 124, -40)
def _():
    r = 300
    yc = TOP - H / 2 - r
    return Skel(V / 2, 0).V(yc).arc(V / 2 + r, yc, r, r, 180, 90 - ARM).stroke()


@glyph("s", 30, 66)
def _():
    return ess(-OVX + H / 2, TOP - H / 2)


@glyph("t", 50, 24)
def _():
    return hook(BAR_ARM + V / 2, CAP, -OVX, 1).band(-9000, CAP) | rect(0, XH - H, 2 * BAR_ARM + V, XH)


@glyph("f", 50, 18)
def _():
    return hook(BAR_ARM + V / 2, 0, ASC + OVX, 1).band(0, 9000) | rect(0, XH - H, 2 * BAR_ARM + V, XH)


@glyph("i", THIN_SB - (DOT - V) / 2, THIN_SB - (DOT - V) / 2)
def _():
    return rect(0, 0, V, XH) | disc(V / 2, DOT_Y, DOT)


@glyph("j", False, adv=400)
def _():
    xs = THIN_SB + V / 2
    return hook(xs, XH, DESC - OVX, -1).band(-9000, XH) | disc(xs, DOT_Y, DOT)


@glyph("l", THIN_SB, 40)
def _():
    return hook(V / 2, ASC, -OVX, 1).band(-9000, ASC)


@glyph("k", 124, -30)
def _():
    yj, sa, sl = 470, 1.095, 1.06
    ha, hl = slant_width(sa, 1), slant_width(sl, 1)
    ax = V + sa * (XH - yj)
    lx = V + sl * yj
    arm = poly((ax - ha, XH), (ax, XH), (V / 2, XH - (ax - V / 2) / sa), (V / 2, XH - (ax - ha - V / 2) / sa))
    leg = poly((lx, 0), (lx + hl, 0), (V / 2, (lx + hl - V / 2) / sl), (V / 2, (lx - V / 2) / sl))
    return rect(0, 0, V, ASC) | arm | leg


@glyph("v", 32, 32)
def _():
    return vee(1044, XH, 0)


@glyph("w", 4, 4)
def _():
    return zigzag(1664, XH, 0)


@glyph("x", -30, -30)
def _():
    return cross(42, 977, 0, 1019, 0, XH)


@glyph("y", 14, 8)
def _():
    w, xb = 1050, 232
    hw = V
    for _ in range(6):
        hw = slant_width(w - hw - xb, XH - DESC)
    s = (w - hw - xb) / (XH - DESC)
    right = poly((w - hw, XH), (w, XH), (xb + hw, DESC), (xb, DESC))
    s2 = 0.445
    hw2 = slant_width(s2, 1)
    tip = meet((0, XH), (s2, XH - 1), (xb, DESC), (xb + s, DESC + 1))
    crotch = meet((hw2, XH), (hw2 + s2, XH - 1), (xb, DESC), (xb + s, DESC + 1))
    left = poly((0, XH), (hw2, XH), crotch, (crotch[0] + 40, crotch[1] - 60), tip)
    return right | left


@glyph("z", -10, -18)
def _():
    return zed(880, XH, 40, 40)
