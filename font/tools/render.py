"""render.py <font> <out.png> <size> [--opsz N] <line>... -- render text lines from a font file into a PNG"""
import sys
from PIL import Image, ImageDraw, ImageFont
args = sys.argv[1:]
opsz = None
if "--opsz" in args:
    i = args.index("--opsz"); opsz = float(args[i + 1]); del args[i:i + 2]
path, out, size = args[0], args[1], int(args[2])
rows = args[3:]
f = ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.BASIC)
if opsz is not None:
    f.set_variation_by_axes([opsz])
pad = size // 4
lh = int(size * 1.3)
w = max(int(f.getlength(r)) for r in rows) + pad * 2
img = Image.new("L", (w, lh * len(rows) + pad), 255)
d = ImageDraw.Draw(img)
for i, r in enumerate(rows):
    d.text((pad, pad // 2 + i * lh), r, font=f, fill=0)
img.save(out)
print(out, img.size)
