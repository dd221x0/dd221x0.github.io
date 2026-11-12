import os
from array import array

from fontTools.agl import UV2AGL
from fontTools.fontBuilder import FontBuilder
from fontTools.misc.timeTools import timestampFromString
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import newTable
from fontTools.ttLib.tables._g_a_s_p import GASP_DOGRAY, GASP_SYMMETRIC_SMOOTHING
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
from fontTools.ttLib.tables.TupleVariation import TupleVariation

from params import ASCENT, CAP, DESCENT, H, OPSZ, UPM, XH

FAMILY = "DD Geo"
PS_NAME = "DDGeo-Regular"
VERSION = "2.000"
COPYRIGHT = "Copyright (c) 2026 dd221x0"
RELEASED = "Wed Nov 11 00:00:00 2026"

GLYPHS = {}


def glyph(ch, lsb=None, rsb=None, adv=None):
    """register a glyph. With lsb and rsb the drawing is placed by its side bearings; with adv alone it is centred
    in that advance; with adv and lsb=False its own x coordinates are kept"""
    def deco(fn):
        GLYPHS[ch] = (fn, lsb, rsb, adv)
        return fn
    return deco


def placed(ch):
    """the glyph's outline in final position, and its advance width"""
    fn, lsb, rsb, adv = GLYPHS[ch]
    shape = fn()
    if shape is None or not shape.contours:
        return None, adv
    x0, _, x1, _ = shape.bounds()
    if lsb is False:
        return shape, adv
    if lsb is None:
        return shape.move((adv - (x1 - x0)) / 2 - x0), adv
    return shape.move(lsb - x0), (adv if adv is not None else round(lsb + (x1 - x0) + rsb))


def _clean(contour, tiny=2.5):
    def snap(p):
        return (round(p[0]), round(p[1]))

    def near(p, q):
        return abs(p[0] - q[0]) < tiny and abs(p[1] - q[1]) < tiny

    start = snap(contour[0][1])
    out = [("M", start)]
    prev = start
    for s in contour[1:]:
        end = snap(s[-1])
        if near(end, prev):
            continue
        out.append(("L", end) if s[0] == "L" else ("C", s[1], s[2], end))
        prev = end
    while len(out) > 1 and near(out[-1][-1], start):
        if out[-1][0] == "L":
            out.pop()
        else:
            out[-1] = ("C", out[-1][1], out[-1][2], start)
            break
    return out


def _area(contour):
    pts = [s[-1] for s in contour]
    return sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pts, pts[1:] + pts[:1])) / 2


def draw(shape, pen):
    total = sum(_area(c) for c in shape.contours)
    for c in shape.contours:
        c = _clean(c)
        if len(c) < 3:
            continue
        pen.moveTo(c[0][1])
        for s in c[1:]:
            if s[0] == "L":
                pen.lineTo(s[1])
            else:
                pen.curveTo(s[1], s[2], s[3])
        pen.closePath()
    return total


def dedupe(g):
    if g.numberOfContours <= 0:
        return g
    coords, flags, ends = [], [], []
    start = 0
    for end in g.endPtsOfContours:
        pts = [(tuple(g.coordinates[i]), g.flags[i] & 1) for i in range(start, end + 1)]
        start = end + 1
        kept = []
        for p in pts:
            if kept and kept[-1][0] == p[0]:
                if p[1] and not kept[-1][1]:
                    kept[-1] = p
                continue
            kept.append(p)
        while len(kept) > 1 and kept[0][0] == kept[-1][0]:
            last = kept.pop()
            if last[1] and not kept[0][1]:
                kept[0] = last
        coords += [p[0] for p in kept]
        flags += [p[1] for p in kept]
        ends.append(len(coords) - 1)
    g.coordinates = GlyphCoordinates(coords)
    g.flags = array("B", flags)
    g.endPtsOfContours = ends
    return g


def swell(g, amount, limit=2.2):
    """how far each point moves when every edge of the outline is pushed outwards by `amount`"""
    out = []
    start = 0
    for end in g.endPtsOfContours:
        pts = [tuple(g.coordinates[i]) for i in range(start, end + 1)]
        start = end + 1
        n = len(pts)
        for i, p in enumerate(pts):
            a, b = pts[i - 1], pts[(i + 1) % n]
            d1 = (p[0] - a[0], p[1] - a[1])
            d2 = (b[0] - p[0], b[1] - p[1])
            l1, l2 = (d1[0] ** 2 + d1[1] ** 2) ** 0.5 or 1, (d2[0] ** 2 + d2[1] ** 2) ** 0.5 or 1
            n1 = (-d1[1] / l1, d1[0] / l1)
            n2 = (-d2[1] / l2, d2[0] / l2)
            k = 1 + n1[0] * n2[0] + n1[1] * n2[1]
            mx, my = n1[0] + n2[0], n1[1] + n2[1]
            if k > 2 / limit ** 2:
                mx, my = mx / k, my / k
            else:
                m = (mx * mx + my * my) ** 0.5 or 1
                mx, my = mx / m * limit, my / m * limit
            out.append((round(mx * amount), round(my * amount)))
    return out + [(0, 0)] * 4


def name_of(ch):
    cp = ord(ch)
    return UV2AGL.get(cp, "uni%04X" % cp)


def build(out_dir, basename, ttf=False):
    order = [".notdef"]
    cmap, glyphs, metrics = {}, {}, {}
    notdef = TTGlyphPen(None)
    for x0, y0, x1, y1, rev in ((120, 0, 880, CAP, False), (120 + H, H, 880 - H, CAP - H, True)):
        pts = [(x0, y0), (x0, y1), (x1, y1), (x1, y0)]
        pts = pts[::-1] if rev else pts
        notdef.moveTo(pts[0])
        for p in pts[1:]:
            notdef.lineTo(p)
        notdef.closePath()
    glyphs[".notdef"] = notdef.glyph()
    metrics[".notdef"] = (1000, 120)
    for ch in sorted(GLYPHS):
        gname = name_of(ch)
        shape, advance = placed(ch)
        tt = TTGlyphPen(None)
        if shape is not None:
            total = draw(shape, Cu2QuPen(tt, max_err=0.5, reverse_direction=False))
            if total > 0:
                tt = TTGlyphPen(None)
                draw(shape, Cu2QuPen(tt, max_err=0.5, reverse_direction=True))
        order.append(gname)
        cmap[ord(ch)] = gname
        glyphs[gname] = dedupe(tt.glyph())
        metrics[gname] = (advance, 0)

    fb = FontBuilder(UPM, isTTF=True)
    fb.font.recalcTimestamp = False
    fb.font["head"].created = fb.font["head"].modified = timestampFromString(RELEASED)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    glyf = fb.font["glyf"]
    for gname in order:
        g = glyf[gname]
        g.recalcBounds(glyf)
        metrics[gname] = (metrics[gname][0], g.xMin if g.numberOfContours else 0)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT, lineGap=0)
    fb.setupNameTable({
        "familyName": FAMILY,
        "styleName": "Regular",
        "uniqueFontIdentifier": f"{FAMILY} Regular {VERSION}",
        "fullName": FAMILY,
        "psName": PS_NAME,
        "version": f"Version {VERSION}",
        "copyright": COPYRIGHT,
    })
    fb.setupOS2(
        version=4, sTypoAscender=ASCENT, sTypoDescender=DESCENT, sTypoLineGap=0,
        usWinAscent=ASCENT, usWinDescent=-DESCENT, sxHeight=XH, sCapHeight=CAP,
        usWeightClass=400, usWidthClass=5, fsSelection=0x40 | 0x80, fsType=0,
        ySubscriptXSize=1300, ySubscriptYSize=1200, ySubscriptXOffset=0, ySubscriptYOffset=150,
        ySuperscriptXSize=1300, ySuperscriptYSize=1200, ySuperscriptXOffset=0, ySuperscriptYOffset=700,
        yStrikeoutSize=H, yStrikeoutPosition=XH // 2, achVendID="DD  ",
        panose=dict(bFamilyType=2, bSerifStyle=11, bWeight=5, bProportion=2, bContrast=2,
                    bStrokeVariation=2, bArmStyle=2, bLetterForm=2, bMidline=2, bXHeight=4),
    )
    fb.setupPost(underlinePosition=-200, underlineThickness=H)
    top = OPSZ[-1]
    fb.setupFvar([("opsz", OPSZ[0][0], OPSZ[0][0], top[0], "Optical Size")], [])
    fb.setupGvar({gname: ([TupleVariation({"opsz": (0.0, 1.0, 1.0)}, swell(glyf[gname], top[1]))]
                          if glyf[gname].numberOfContours > 0 else []) for gname in order})
    avar = newTable("avar")
    avar.segments = {"opsz": {-1.0: -1.0, **{round((s - OPSZ[0][0]) / (top[0] - OPSZ[0][0]), 4): round(d / top[1], 4) for s, d in OPSZ}}}
    fb.font["avar"] = avar
    gasp = newTable("gasp")
    gasp.version = 1
    gasp.gaspRange = {65535: GASP_DOGRAY | GASP_SYMMETRIC_SMOOTHING}
    fb.font["gasp"] = gasp
    os.makedirs(out_dir, exist_ok=True)
    if ttf:
        fb.save(os.path.join(out_dir, basename + ".ttf"))
    fb.font.flavor = "woff2"
    path = os.path.join(out_dir, basename + ".woff2")
    fb.font.save(path)
    return path
