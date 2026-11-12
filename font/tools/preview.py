"""sheet(shapes, out.png): draw geom Shapes side by side, for trying out constructions before they become glyphs"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from PIL import Image, ImageChops, ImageDraw


def flat(contour, n=20):
    pts = [contour[0][1]]
    for s in contour[1:]:
        p0 = pts[-1]
        if s[0] == "L":
            pts.append(s[1])
        else:
            for i in range(1, n + 1):
                t = i / n; u = 1 - t
                pts.append((u**3 * p0[0] + 3*u*u*t * s[1][0] + 3*u*t*t * s[2][0] + t**3 * s[3][0],
                            u**3 * p0[1] + 3*u*u*t * s[1][1] + 3*u*t*t * s[2][1] + t**3 * s[3][1]))
    return pts


def sheet(shapes, out, scale=0.3, gap=120, y0=-500, y1=1750, lines=(0, 1100, 1500)):
    xs = []
    x = gap
    for sh in shapes:
        b = sh.bounds()
        xs.append(x - b[0])
        x += (b[2] - b[0]) + gap
    W, Hh = int(x * scale * 2), int((y1 - y0) * scale * 2)
    acc = Image.new("1", (W, Hh), 0)
    for sh, dx in zip(shapes, xs):
        for c in sh.contours:
            im = Image.new("1", (W, Hh), 0)
            ImageDraw.Draw(im).polygon([((px + dx) * scale * 2, (y1 - py) * scale * 2) for px, py in flat(c)], fill=1)
            acc = ImageChops.logical_xor(acc, im)
    img = Image.eval(acc.convert("L"), lambda v: 255 - v).resize((W // 2, Hh // 2), Image.LANCZOS).convert("RGB")
    d = ImageDraw.Draw(img)
    for ly in lines:
        d.line([(0, (y1 - ly) * scale), (img.width, (y1 - ly) * scale)], fill=(255, 170, 170))
    img.save(out)
    print(out, img.size)
