from fontbuild import glyph, placed
from forms import *
from geom import *
from params import *
from punct import MATH, OPW, SPACE, chevron, comma, dot, hbar
from upper import CYC


def raw(ch):
    return placed(ch)[0]


@glyph(" ", lsb=False, adv=SPACE)
def _():
    return None


@glyph("–", lsb=False, adv=1000)
def _():
    return rect(-10, XH / 2 - H / 2, 1010, XH / 2 + H / 2)


@glyph("—", lsb=False, adv=2000)
def _():
    return rect(-10, XH / 2 - H / 2, 2010, XH / 2 + H / 2)


@glyph("−", adv=MATH)
def _():
    return hbar(CYC)


@glyph("×", adv=MATH)
def _():
    d = 330
    return (Skel(OPW / 2 - d, CYC - d).L(OPW / 2 + d, CYC + d).stroke(VF, HF / VF)
            | Skel(OPW / 2 - d, CYC + d).L(OPW / 2 + d, CYC - d).stroke(VF, HF / VF))


@glyph("÷", adv=MATH)
def _():
    return hbar(CYC) | disc(OPW / 2, CYC + 360, DOT) | disc(OPW / 2, CYC - 360, DOT)


@glyph("±", adv=MATH)
def _():
    return hbar(CYC + 140) | rect(OPW / 2 - VF / 2, CYC - 250, OPW / 2 + VF / 2, CYC + 530) | hbar(HF / 2)


@glyph("•", adv=MATH)
def _():
    return disc(0, CYC, 520)


@glyph("·", adv=SPACE)
def _():
    return dot(CYC - DOT / 2)


@glyph("…", lsb=False, adv=2000)
def _():
    return dot().move(201) | dot().move(868) | dot().move(1535)


@glyph("°", 70, 70)
def _():
    return ring(0, CAP + OVC - 640, 640, CAP + OVC, VS, HS)


def guillemet():
    return chevron(400, 800, (V, H)).move(0, XH / 2 - CYC)


@glyph("‹", 60, 60)
def _():
    return guillemet()


@glyph("›", 60, 60)
def _():
    return guillemet().flipx(0)


@glyph("«", 60, 60)
def _():
    return guillemet() | guillemet().move(430)


@glyph("»", 60, 60)
def _():
    return (guillemet() | guillemet().move(430)).flipx(0)


@glyph("¡", adv=590)
def _():
    return raw("!").rot(180, (0, XH / 2))


@glyph("¿", 70, 70)
def _():
    return raw("?").rot(180, (0, XH / 2))


RAISE = CAP - 240


@glyph("’", adv=SPACE)
def _():
    return comma(RAISE)


@glyph("‘", adv=SPACE)
def _():
    return comma(RAISE).rot(180, (135, RAISE + 21))


@glyph("‚", adv=SPACE)
def _():
    return comma()


@glyph("”", 100, 100)
def _():
    return comma(RAISE) | comma(RAISE).move(370)


@glyph("“", 100, 100)
def _():
    q = comma(RAISE).rot(180, (135, RAISE + 21))
    return q | q.move(370)


@glyph("„", 100, 100)
def _():
    return comma() | comma().move(370)
