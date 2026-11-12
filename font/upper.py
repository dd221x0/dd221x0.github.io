import math

from fontbuild import glyph
from forms import *
from geom import *
from params import *

RC = (CAP + 2 * OVC) / 2
DC = 2 * RC
CYC = CAP / 2
TOPC = CAP + OVC
MID = (706, 706 + HC)
SBC = 150
RBC = 90
SQ = HC / VC


def cring():
    return ring(0, -OVC, DC, TOPC, VRC, HRC)


def lobe(x0, y0, y1, reach, side=0, top=0):
    """flat-sided bowl from the stem at x0: straight, then a half circle, reaching `reach`; side/top inset it"""
    r = (y1 - y0) / 2
    xa = reach - r
    return (Pen(x0, y0 + top).V(y1 - top).H(xa).QH(reach - side, (y0 + y1) / 2, KO).QV(xa, y0 + top, KO).shape())


@glyph("O", RBC, RBC)
def _():
    return cring()


@glyph("Q", RBC, adv=round(DC + 2 * RBC))
def _():
    return cring() | bar(1010, 400, 1470, -130, VC, HC)


@glyph("C", RBC, 70)
def _():
    return cring() - sector(RC, CYC, -ARM, ARM)


@glyph("G", RBC, 86)
def _():
    full = oval(0, -OVC, DC, TOPC)
    a = math.radians(ARM)
    gap = poly((RC, CYC), (RC + 4000, CYC), (RC + 4000, CYC + 4000), (RC + 4000 * math.cos(a), CYC + 4000 * math.sin(a)))
    return (cring() - gap) | (rect(RC + 150, CYC - HC, DC, CYC) & full)


@glyph("D", SBC, 88)
def _():
    w = 1254
    return lobe(0, 0, CAP, w) - lobe(VC, 0, CAP, w, VRC, HC)


@glyph("B", SBC, 70)
def _():
    up, lo = 783, 904
    return ((lobe(0, MID[0], CAP, up) | lobe(0, 0, MID[1], lo))
            - lobe(VC, MID[0], CAP, up, VRC, HC) - lobe(VC, 0, MID[1], lo, VRC, HC))


P_FOOT = 700


def p_bowl():
    return (rect(0, 0, VC, CAP) | lobe(0, P_FOOT, CAP, 940)) - lobe(VC, P_FOOT, CAP, 940, VRC, HC)


@glyph("P", SBC, 60)
def _():
    return p_bowl()


@glyph("R", SBC, 30)
def _():
    s, foot, y = 0.775, 1000, P_FOOT + HC / 2
    hw = slant_width(s, 1, VC, HC)
    return p_bowl() | poly((foot - hw, 0), (foot, 0), (foot - s * y, y), (foot - hw - s * y, y))


@glyph("E", SBC, 62)
def _():
    return rect(0, 0, VC, CAP) | rect(0, 0, 860, HC) | rect(0, MID[0], 830, MID[1]) | rect(0, CAP - HC, 860, CAP)


@glyph("F", SBC, 50)
def _():
    return rect(0, 0, VC, CAP) | rect(0, MID[0], 730, MID[1]) | rect(0, CAP - HC, 760, CAP)


@glyph("L", SBC, 40)
def _():
    return rect(0, 0, VC, CAP) | rect(0, 0, 735, HC)


@glyph("H", SBC, SBC)
def _():
    return rect(0, 0, VC, CAP) | rect(1064 - VC, 0, 1064, CAP) | rect(0, MID[0], 1064, MID[1])


@glyph("I", 131, 131)
def _():
    return rect(0, 0, VC, CAP)


@glyph("T", 12, 12)
def _():
    return rect(0, CAP - HC, 832, CAP) | rect(416 - VC / 2, 0, 416 + VC / 2, CAP)


@glyph("U", 158, 158)
def _():
    w = 995
    ys = -OVC + w / 2
    return (Pen(0, CAP).V(ys).QV(w / 2, -OVC, KO).QH(w, ys, KO).V(CAP).H(w - VC).V(ys)
            .QV(w / 2, -OVC + HRC, KO).QH(VC, ys, KO).V(CAP).shape())


@glyph("J", 60, 158)
def _():
    xs, r = 625, 295
    ya = -OVC + HC / 2 + r
    return Skel(xs, CAP).V(ya).arc(xs - r, ya, r, r, 0, -180).stroke(VC, SQ)


@glyph("S", 44, 76)
def _():
    return ess(-OVC + HC / 2, TOPC - HC / 2, stretch=1.08, pen=UPP)


@glyph("A", 22, 22)
def _():
    w, flat = 1428, 38
    hull = poly((0, 0), (w / 2 - flat / 2, CAP), (w / 2 + flat / 2, CAP), (w, 0))
    return vee(w, 0, CAP, flat, UPP) | (rect(0, 440, w, 440 + HC) & hull)


@glyph("V", 40, 40)
def _():
    return vee(1316, CAP, 0, 38, UPP)


@glyph("W", 40, 40)
def _():
    return zigzag(1776, CAP, 0, 38, UPP)


@glyph("M", 86, 86)
def _():
    w, lean, flat = 1663, 210, 38
    hl = slant_width(lean, CAP, VC, HC)
    hd = VC
    for _ in range(6):
        sd = (w / 2 - flat / 2 + hd - lean - flat) / CAP
        hd = slant_width(sd, 1, VC, HC)
    notch = meet((hl, 0), (hl + lean, CAP), (w / 2 - flat / 2, 0), (w / 2 - flat / 2 - sd, 1))
    crotch = (w / 2, CAP - (w / 2 - lean - flat) / sd)
    return poly((0, 0), (hl, 0), notch, (w / 2 - flat / 2, 0), (w / 2 + flat / 2, 0), (w - notch[0], notch[1]),
                (w - hl, 0), (w, 0), (w - lean, CAP), (w - lean - flat, CAP), crotch, (lean + flat, CAP), (lean, CAP))


@glyph("N", SBC, SBC)
def _():
    w, flat = 1172, 38
    hw = VC
    for _ in range(6):
        s = (w - 2 * flat + hw) / CAP
        hw = slant_width(s, 1, VC, HC)
    return poly((0, 0), (VC, 0), (VC, (w - flat - VC) / s), (w - flat, 0), (w, 0), (w, CAP), (w - VC, CAP),
                (w - VC, CAP - (w - VC - flat) / s), (flat, CAP), (0, CAP))


@glyph("X", 46, 46)
def _():
    return cross(30, 1098, 0, 1128, 0, CAP, UPP)


@glyph("Y", 40, 40)
def _():
    w, yo = 1105, 712
    x0, x1 = w / 2 - VC / 2, w / 2 + VC / 2
    s = x0 / (CAP - yo)
    hw = slant_width(s, 1, VC, HC)
    return poly((0, CAP), (hw, CAP), (w / 2, CAP - (w / 2 - hw) / s), (w - hw, CAP), (w, CAP), (x1, yo), (x1, 0),
                (x0, 0), (x0, yo))


@glyph("Z", 32, 60)
def _():
    return zed(866, CAP, 48, 48, UPP)


@glyph("K", SBC, 20)
def _():
    yj, top, foot = 690, 940, 990
    sa = (top - VC) / (CAP - yj)
    ha = slant_width(sa, 1, VC, HC)
    hl = VC
    for _ in range(6):
        sl = (foot - hl - VC) / yj
        hl = slant_width(sl, 1, VC, HC)
    x = VC / 2
    arm = poly((top - ha, CAP), (top, CAP), (x, CAP - (top - x) / sa), (x, CAP - (top - ha - x) / sa))
    leg = poly((foot - hl, 0), (foot, 0), (x, (foot - x) / sl), (x, (foot - hl - x) / sl))
    return rect(0, 0, VC, CAP) | arm | leg
