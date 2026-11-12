import math

from fontbuild import glyph
from forms import *
from geom import *
from params import *
from lower import TOP
from upper import SQ, TOPC, CYC

SPACE = 554
MATH = 1212
OPW = 990


def dot(y=-OVX):
    return disc(DOT / 2, y + DOT / 2, DOT)


def comma(y=0):
    return bar(70, -190, 200, 232).move(0, y)


@glyph(" ", lsb=False, adv=SPACE)
def _():
    return None


@glyph(".", adv=SPACE)
def _():
    return dot()


@glyph(",", adv=SPACE)
def _():
    return comma()


@glyph(":", adv=SPACE)
def _():
    return dot() | dot(TOP - DOT)


@glyph(";", adv=SPACE)
def _():
    return comma() | dot(TOP - DOT).move(200 - DOT / 2)


@glyph("!", adv=590)
def _():
    return rect(DOT / 2 - V / 2, 400, DOT / 2 + V / 2, CAP) | dot()


@glyph("?", 70, 70)
def _():
    r = 300
    cy = TOPC - H / 2 - r
    px, py = on_ellipse(0, cy, r, r, -60)
    c2 = (px + r / 2, py - r * math.sin(math.radians(60)))
    curl = (Skel(*on_ellipse(0, cy, r, r, 180)).arc(0, cy, r, r, 180, -60)
            .arc(c2[0], c2[1], r, r, 120, 180).V(400).stroke())
    return curl | dot().move(-DOT / 2)


def tick(dx=0):
    return rect(0, 990, V, CAP).move(dx)


@glyph('"', 70, 70)
def _():
    return tick() | tick(V + 150)


@glyph("'", 70, 70)
def _():
    return tick()


@glyph("-", 44, 44)
def _():
    return rect(0, XH / 2 - H / 2, 580, XH / 2 + H / 2)


@glyph("_", lsb=False, adv=1000)
def _():
    return rect(-10, -150 - H, 1010, -150)


@glyph("|", adv=560)
def _():
    return rect(0, DESC, V, ASC)


@glyph("/", 20, 20)
def _():
    return bar(0, -200, 650, ASC)


@glyph("\\", 20, 20)
def _():
    return bar(650, -200, 0, ASC)


def hbar(y):
    return rect(0, y - HF / 2, OPW, y + HF / 2)


@glyph("+", adv=MATH)
def _():
    return hbar(CYC) | rect(OPW / 2 - VF / 2, CYC - OPW / 2, OPW / 2 + VF / 2, CYC + OPW / 2)


@glyph("=", adv=MATH)
def _():
    return hbar(CYC - 215) | hbar(CYC + 215)


def chevron(w, h, pen=FIGURE):
    """open angle pointing left, w wide and h tall, with vertical cuts"""
    sk = Skel(w + 400, CYC + (h / 2) * (w + 400) / w).L(0, CYC).L(w + 400, CYC - (h / 2) * (w + 400) / w)
    s = sk.stroke(pen[0], pen[1] / pen[0])
    x0 = s.bounds()[0]
    return (s & rect(x0 + 60, -3000, x0 + 60 + w, 3000)).move(-x0 - 60)


@glyph("<", adv=MATH)
def _():
    return chevron(OPW, 900)


@glyph(">", adv=MATH)
def _():
    return chevron(OPW, 900).flipx(OPW / 2)


@glyph("^", 100, 100)
def _():
    return vee(1000, 560, CAP, FLAT, FIGURE)


@glyph("`", 120, 220)
def _():
    return bar(335, 1330, 95, 1640, *SMALL)


@glyph("~", adv=MATH)
def _():
    w, th = 850, math.radians(50)
    r = w / 4 / math.sin(th)
    d = r * math.cos(th)
    t = math.degrees(th)
    return (Skel(0, CYC).arc(w / 4, CYC - d, r, r, 90 + t, 90 - t).arc(3 * w / 4, CYC + d, r, r, 270 - t, 270 + t)
            .stroke(VF, HF / VF))


def paren():
    h, sag = ASC - DESC, 215
    r = (h * h / 4 + sag * sag) / (2 * sag)
    cy = (ASC + DESC) / 2
    half = math.degrees(math.asin((h / 2 + 40) / r))
    return Skel(*on_ellipse(r, cy, r, r, 180 - half)).arc(r, cy, r, r, 180 - half, 180 + half).stroke().band(DESC, ASC)


@glyph("(", 150, 70)
def _():
    return paren()


@glyph(")", 70, 150)
def _():
    return paren().flipx(0)


def bracket():
    return rect(0, DESC, V, ASC) | rect(0, DESC, 360, DESC + H) | rect(0, ASC - H, 360, ASC)


@glyph("[", 230, 80)
def _():
    return bracket()


@glyph("]", 80, 230)
def _():
    return bracket().flipx(0)


def brace():
    ym, yt, r = (DESC + ASC) / 2, ASC - H / 2, 160
    half = Skel(430, yt).H(255 + r).QH(255, yt - r).V(ym + r).QV(255 - r, ym).stroke()
    return half | half.flipy(ym)


@glyph("{", 120, 80)
def _():
    return brace()


@glyph("}", 80, 120)
def _():
    return brace().flipx(0)


@glyph("*", 80, 80)
def _():
    cy, r = 1180, 350
    arms = [Skel(-r * math.cos(a), cy - r * math.sin(a)).L(r * math.cos(a), cy + r * math.sin(a)).stroke(VS, HS / VS)
            for a in (math.radians(90), math.radians(30), math.radians(150))]
    return arms[0] | arms[1] | arms[2]


@glyph("#", 90, 90)
def _():
    lean = 0.16
    up = lambda x: bar(x, 0, x + lean * CAP, CAP, *SMALL)
    return (up(210) | up(650) | rect(60, 510 - HS / 2, 1150, 510 + HS / 2) | rect(110, 990 - HS / 2, 1200, 990 + HS / 2))


@glyph("$", adv=1110)
def _():
    s = ess(-OVC + HC / 2, TOPC - HC / 2, stretch=1.2, pen=UPP)
    b = s.bounds()
    cx = (b[0] + b[2]) / 2
    return s | rect(cx - VS / 2, -230, cx + VS / 2, 1730)


@glyph("%", 70, 70)
def _():
    d, t = 640, SMALL
    o = ring(0, 0, d, d, *t)
    return o.move(0, TOPC - d) | o.move(820, -OVC) | bar(330, -60, 1130, CAP + 60, *SMALL)


@glyph("&", 90, 40)
def _():
    ru, rl, reach = 255, 395, 740
    cu = (510, TOPC - HC / 2 - ru)
    cl = (430, -OVC + HC / 2 + rl)
    foot = (1290, -60)
    a1 = tangent_angle(foot, cu[0], cu[1], ru, ru, 180, 270)
    d, sr = math.hypot(cl[0] - cu[0], cl[1] - cu[1]), ru + rl
    u = math.degrees(math.atan2(cl[1] - cu[1], cl[0] - cu[0]) - math.atan2(sr, math.sqrt(d * d - sr * sr))) % 360
    out = 90 - 2 * ARM
    p4 = on_ellipse(cl[0], cl[1], rl, rl, out - 90)
    tip = (p4[0] + reach * math.cos(math.radians(out)), p4[1] + reach * math.sin(math.radians(out)))
    sk = (Skel(*foot).L(*on_ellipse(cu[0], cu[1], ru, ru, a1)).arc(cu[0], cu[1], ru, ru, a1, u - 270)
          .L(*on_ellipse(cl[0], cl[1], rl, rl, u - 90)).arc(cl[0], cl[1], rl, rl, u - 90, out + 270).L(*tip))
    return sk.stroke(VC, SQ, join="round") - rect(900, -900, 4000, 0)


@glyph("@", 80, 80)
def _():
    pen = SMALL
    big, ra, drop = 713, 270, 60
    rh = (big - ra) / 2
    sq = pen[1] / pen[0]
    ring_ = (Skel(ra, ra + pen[1] / 2).V(-drop).arc(ra + rh, -drop, rh, rh, 180, 360).V(0)
             .arc(0, 0, big, big, 0, 360 - 2 * ARM).stroke(pen[0], sq, join="round"))
    bowl = Skel(ra, 0).arc(0, 0, ra, ra, 0, 360).stroke(pen[0], sq, closed=True)
    return (ring_ | bowl).move(0, CYC)
