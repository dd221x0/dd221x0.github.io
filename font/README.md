# DD Geo

Source of `DDGeo.woff2`, the site's typeface. Every glyph is a small Python construction that follows the framework below.

    python3 -m venv .venv && .venv/bin/pip install -r font/requirements.txt
    .venv/bin/python font/build.py

`build.py` writes `DDGeo.woff2` next to `index.html`. When the file changes, bump the `?v=` in `commonStyles.css`. Open `font/specimen.html` through the local server to review glyphs.

## Framework

1. **Compass and ruler.** A stroke is a straight line or an arc of a circle, and arcs meet lines only where they are tangent. No free curves, no tapers: where strokes meet they simply overlap.
2. **One pen per size of sign.** Stems are `V` wide and horizontals `H` tall; everything else gets the thickness that pen gives at its angle. Capitals (`VC HC`) and figures (`VF HF`) use slightly heavier pens, small dense symbols (`% @ # * °`, accents) a lighter one (`VS HS`).
3. **Fewest strokes, no spurs.** A letter is drawn in as few continuous strokes as it can be: `s S n u h r l 2 ? &` are one stroke each. A stem stops where it meets a round part, so `n m h r u` and `b d g p q` have no corner sticking out past the curve. `a` is the exception: it would become an `o`.
4. **Ends.** Curved strokes end square to their direction; straight strokes end flat on the baseline, x-height or cap line. An open bowl stops `ARM` degrees short of the horizontal (`c e s C G S`), twice that where it would crowd another stroke (`@`). A free hook runs to its extreme and ends flat there (`2 3 5 ? J`). A descender or ascender that turns ends in the shared hook and a straight run (`f g j l t`).
5. **Symmetry.** What can be symmetric is, and inner parts are centred. Rotations are literal: `u` is `n` turned over, `b`/`q`, `d`/`p`, `6`/`9`, and `s z N` map onto themselves. Where two bowls are stacked the upper one is a little smaller (`B S 3 8`).
6. **Shared parts.** One circle for all round lowercase, one for round capitals, two stacked circles for `3 5 6 8 9`, one quarter-circle hook (`HOOK`) for `f g j l t`, one dot (`DOT`), one figure diagonal (`DIAG`) for the flag of `1` and the slant of `4`. A stem that runs into a bowl points at the bowl's centre, so it merges without a notch (`5`).
7. **Kept from Century Gothic on purpose.** Single-storey `a` built from the `o` circle plus a full stem, round dots, pointed joins with sharp corners and no overshoot (`A V W M N v w 1 4`, the foot of `2`, `7`), `M` with slightly leaning legs, wide circular proportions with a large x-height.
8. **Fit for this site.** Codes must be unambiguous: `l` has a hook, `I` is bare, `1` has a flag, `0` is a stadium and `O` a circle. The line box is 1 em above the baseline and ¼ em below, with cap height ¾ em, so lines land on whole pixels at 16px and 20px. The `opsz` axis thickens strokes as the size grows (`OPSZ`: px size, swell per side), applied by browsers automatically.

## Files

`params.py` sizes, `geom.py` drawing toolkit, `forms.py` shared constructions, `lower.py` `upper.py` `digits.py` `punct.py` `extra.py` glyphs, `fontbuild.py` assembly.

`../glacial-indifference/` is a reference for the overall feel (SIL Open Font License, licence text included). Ideas may be taken from it where they fit the framework; outlines are never copied from it or from Century Gothic.

## Tools

    .venv/bin/python font/build.py /tmp/ddgeo --ttf
    .venv/bin/python font/tools/qa.py /tmp/ddgeo/DDGeo.ttf
    .venv/bin/python font/tools/render.py /tmp/ddgeo/DDGeo.ttf /tmp/sample.png 150 --opsz 20 "abc 123"
    .venv/bin/python font/tools/check.py ink
    .venv/bin/python font/tools/check.py layout
    .venv/bin/python font/tools/check.py layout --cross

- `qa.py`: tiny or reversed contours, duplicate points, missing ASCII, vertical metrics.
- `render.py`: a quick PNG of text in any font file; `--opsz` picks the optical size.
- `preview.py`: `sheet(shapes, out)` draws constructions side by side before they become glyphs.
- `check.py ink`: screenshots the same text in the new font and in Century Gothic with the old fake-bold CSS, in Chrome and Firefox, and prints new/old ink per size. Within about 0.97–1.03 means the weight matches.
- `check.py layout`: loads every page of `master` and of the working tree and prints which element boxes moved; `--cross` compares the working tree in Chrome and Firefox. Both flag input fields whose text overflows.
