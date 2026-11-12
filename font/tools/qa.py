"""qa.py <ttf> -- structural checks on the built font"""
import sys, math
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.areaPen import AreaPen

f = TTFont(sys.argv[1])
gs = f.getGlyphSet()
glyf = f["glyf"]
issues = 0
tot_pts = 0
for name in f.getGlyphOrder():
    g = glyf[name]
    if g.numberOfContours <= 0:
        continue
    coords, ends, flags = g.getCoordinates(glyf)
    tot_pts += len(coords)
    start = 0
    areas = []
    for e in ends:
        pts = [coords[i] for i in range(start, e + 1)]
        start = e + 1
        a = sum(p[0] * q[1] - q[0] * p[1] for p, q in zip(pts, pts[1:] + pts[:1])) / 2
        areas.append(a)
        if abs(a) < 400:
            print(f"  {name}: tiny contour area={a:.0f} pts={len(pts)}"); issues += 1
        for p, q in zip(pts, pts[1:] + pts[:1]):
            if p == q:
                print(f"  {name}: duplicate point {p}"); issues += 1
            elif math.hypot(p[0] - q[0], p[1] - q[1]) < 2:
                print(f"  {name}: very short segment {p}->{q}"); issues += 1
    big = max(areas, key=abs)
    if big > 0:
        print(f"  {name}: outer contour is counter-clockwise"); issues += 1
    if g.yMax > 1989 or g.yMin < -451:
        print(f"  {name}: outside win metrics {g.yMin}..{g.yMax}"); issues += 1
cm = f.getBestCmap()
missing = [chr(c) for c in range(0x20, 0x7F) if c not in cm]
print("glyphs", len(f.getGlyphOrder()), "points", tot_pts, "ascii missing", missing, "issues", issues)
print("hhea", f["hhea"].ascent, f["hhea"].descent, f["hhea"].lineGap, "typo", f["OS/2"].sTypoAscender, f["OS/2"].sTypoDescender, f["OS/2"].sTypoLineGap,
      "win", f["OS/2"].usWinAscent, f["OS/2"].usWinDescent, "upm", f["head"].unitsPerEm)
