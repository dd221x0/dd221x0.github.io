import math

from fontbuild import glyph
from forms import *
from geom import *
from params import *
from upper import TOPC

SQ = HF / VF

FIG = 1110
RU, RL = 330, 383
YL = -OVC + HF / 2 + RL
YU = YL + RL + RU


def circle(cx, cy, r, a0=0, a1=360):
    """stroke along a circle (or an arc of it, clockwise when a1 < a0) with the figure pen"""
    sk = Skel(*on_ellipse(cx, cy, r, r, a0)).arc(cx, cy, r, r, a0, a1)
    return sk.stroke(VF, SQ, closed=abs(a1 - a0) >= 360)


@glyph("0", adv=FIG)
def _():
    w = 1000
    r = w / 2

    def stadium(inset_x, inset_y):
        x0, x1, y0, y1 = inset_x, w - inset_x, -OVC + inset_y, TOPC - inset_y
        return (Pen(x1, -OVC + r).V(TOPC - r).QV(r, y1, K).QH(x0, TOPC - r, K).V(-OVC + r)
                .QV(r, y0, K).QH(x1, -OVC + r, K).shape())
    return stadium(0, 0) - stadium(VRF, HRF)


FOUR = (1048, 688, 350)
DIAG = (FOUR[1] + VF - FLAT) / (CAP - FOUR[2])


@glyph("1", adv=FIG)
def _():
    h = 520
    hw = slant_width(DIAG, 1, VF, HF)
    tip = (VF - FLAT - DIAG * h, CAP - h)
    inner = (tip[0] + hw, tip[1])
    return poly(tip, (VF - FLAT, CAP), (VF, CAP), (VF, 0), (0, 0), (0, inner[1] - inner[0] / DIAG), inner)


@glyph("2", adv=FIG)
def _():
    r = 390
    cy = TOPC - HF / 2 - r

    def draw(bx):
        b = (bx, HF / 2)
        t = tangent_angle(b, 0, cy, r, r, -85, -5)
        return Skel(-r, cy).arc(0, cy, r, r, 180, t).L(*b).H(r + VF / 2).stroke(VF, SQ)
    bx = -r
    bx += (-r - VF / 2) - draw(bx).bounds()[0]
    return draw(bx)


@glyph("3", adv=FIG)
def _():
    return circle(0, YU, RU, 180, -90) | circle(0, YL, RL, 90, -180)


@glyph("4", adv=FIG)
def _():
    w, x0, y0 = FOUR
    x1, s = x0 + VF, DIAG
    hw = slant_width(s, 1, VF, HF)
    return (poly((0, y0), (x1 - FLAT, CAP), (x1, CAP), (x1, y0 + HF), (w, y0 + HF), (w, y0), (x1, y0), (x1, 0),
                 (x0, 0), (x0, y0))
            - poly((hw + s * HF, y0 + HF), (x0, y0 + HF), (x0, y0 + (x0 - hw) / s)))


@glyph("5", adv=FIG)
def _():
    t = math.radians(110)
    dx, dy = math.cos(t), math.sin(t)
    far = (CAP + 400 - YL) / dy
    stem = Skel(0, YL).L(far * dx, YL + far * dy).stroke(VF, SQ).band(-9000, CAP)
    stem = stem - oval(-RL + VF / 2, YL - RL + HF / 2, RL - VF / 2, YL + RL - HF / 2, K)
    xl = (CAP - YL) * dx / dy - slant_width(dx / dy, 1, VF, HF) / 2
    right_of_stem = poly((xl, CAP), (xl - 4000 * dx, CAP - 4000 * dy), (5000, -5000), (5000, 5000), (xl + 4000 * dx, CAP + 4000 * dy))
    top = rect(xl - 600, CAP - HF, RU + 30, CAP) & right_of_stem
    return top | stem | circle(0, YL, RL, 110, -180)


def six():
    t = tangent_angle((320, CAP + 200), 0, YL, RL, RL, 100, 175)
    p = on_ellipse(0, YL, RL, RL, t)
    s = (320 - p[0]) / (CAP + 200 - p[1])
    return circle(0, YL, RL) | bar(p[0], p[1], p[0] + s * (CAP - p[1]), CAP, VF, HF)


@glyph("6", adv=FIG)
def _():
    return six()


@glyph("9", adv=FIG)
def _():
    return six().rot(180, (0, CAP / 2))


@glyph("7", adv=FIG)
def _():
    w, foot = 955, 140
    hw = VF
    for _ in range(6):
        hw = slant_width(w - hw - foot, CAP, VF, HF)
    s = (w - hw - foot) / CAP
    return (poly((0, CAP - HF), (0, CAP), (w, CAP), (w - s * HF, CAP - HF))
            | poly((foot, 0), (foot + hw, 0), (w, CAP), (w - hw, CAP)))


@glyph("8", adv=FIG)
def _():
    return circle(0, YL, RL) | circle(0, YU, RU)
