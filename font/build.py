import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import fontbuild
import lower  # noqa: F401
for name in ("upper", "digits", "punct", "extra"):
    if os.path.exists(os.path.join(HERE, name + ".py")):
        __import__(name)

if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out = args[0] if args else os.path.dirname(HERE)
    print(fontbuild.build(out, "DDGeo", ttf="--ttf" in sys.argv), len(fontbuild.GLYPHS), "glyphs")
