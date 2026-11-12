"""Browser checks for the font, run against the real site.

    python font/tools/check.py ink              rendered weight of the working tree font vs the old Century Gothic look
    python font/tools/check.py layout           element boxes of every page: base branch (Chrome) vs working tree (Chrome)
    python font/tools/check.py layout --cross   element boxes of every page: working tree in Chrome vs Firefox

Options: --base REF (default master) is what `layout` compares against; --font PATH replaces DDGeo.woff2 for `ink`;
--work DIR keeps the generated pages and screenshots (default: a temporary folder). Needs Google Chrome and Firefox
installed in /Applications.
"""
import argparse
import html
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FIREFOX = "/Applications/Firefox.app/Contents/MacOS/firefox"
PORT = 8766

PAGES = ["/index.html", "/index.html&expand=1", "/utils/md5/", "/utils/uuid/", "/utils/gitbranchname/",
         "/utils/countdown/", "/utils/password/", "/utils/color/"]
VIEWS = [(1280, 800), (390, 844)]

INK_LINES = ["md5 uuid gitbranchname countdown password", "copy generate apply string special characters",
             "0123456789 d41d8cd98f00b204e9800998ecf8427e", "UPPER CASE PASSWORD RGB"]
INK_SIZES = [16, 20, 28, 38.4, 64, 102.4, 172, 275]
INK_ROW = {16: 30, 20: 36, 28: 48, 38.4: 64, 64: 100, 102.4: 150, 172: 250, 275: 400}
OLD_LOOK = "div { font-synthesis-weight: none; -webkit-text-stroke-width: calc(0.035em - 0.25px); }"


def serve(root, reports):
    """static server for `root` with no caching, plus POST /report?key= (store a result) and GET /wait?key= (block until stored)"""
    done = set()

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=root, **k)

        def log_message(self, *a):
            pass

        def end_headers(self):
            self.send_header("Cache-Control", "no-store")
            super().end_headers()

        def do_POST(self):
            key = parse_qs(urlparse(self.path).query).get("key", ["x"])[0]
            body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
            with open(os.path.join(reports, key + ".json"), "wb") as f:
                f.write(body)
            done.add(key)
            self.send_response(200)
            self.send_header("Content-Length", "0")
            self.end_headers()

        def do_GET(self):
            u = urlparse(self.path)
            if u.path == "/wait":
                key = parse_qs(u.query).get("key", ["x"])[0]
                start = time.time()
                while key not in done and time.time() - start < 40:
                    time.sleep(0.1)
                time.sleep(0.3)
                self.send_response(200)
                self.send_header("Content-Type", "image/gif")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
            super().do_GET()

    os.makedirs(reports, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def screenshot(browser, url, out, w, h, work):
    if browser == "chrome":
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--force-device-scale-factor=1", f"--window-size={w},{h}",
                        "--virtual-time-budget=8000", f"--screenshot={out}", url], capture_output=True, timeout=180)
    else:
        subprocess.run([FIREFOX, "--headless", "--no-remote", "--profile", os.path.join(work, "ffprofile"), f"--window-size={w},{h}",
                        "--screenshot", out, url], capture_output=True, timeout=180)


def ink(work, font):
    """sum of pixel brightness per line of text, new font over the old look, at each size"""
    d = os.path.join(work, "ink")
    os.makedirs(d, exist_ok=True)
    shutil.copy(os.path.join(ROOT, "CenturyGothic.ttf"), os.path.join(d, "old.ttf"))
    shutil.copy(font, os.path.join(d, "new.woff2"))
    for kind, src, extra in (("old", "old.ttf", OLD_LOOK), ("new", "new.woff2", "")):
        rows = "".join(f'<div style="font-size:{s}px;height:{INK_ROW[s]}px;line-height:{INK_ROW[s]}px">{l if s < 100 else l[:int(2400 / s)]}</div>'
                       for s in INK_SIZES for l in INK_LINES)
        with open(os.path.join(d, kind + ".html"), "w") as f:
            f.write(f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>@font-face {{ font-family: T; src: url({src}); }}
html {{ background: #000; }} body {{ background: #000; color: #bbb; margin: 0; font-family: T; opacity: 0.8; }}
div {{ white-space: pre; overflow: hidden; padding-left: 10px; }} {extra}</style></head><body>{rows}</body></html>""")
    h = sum(INK_ROW[s] * len(INK_LINES) for s in INK_SIZES)
    for browser in ("chrome", "firefox"):
        shots = {}
        for kind in ("old", "new"):
            out = os.path.join(work, f"ink_{browser}_{kind}.png")
            screenshot(browser, f"http://127.0.0.1:{PORT}/ink/{kind}.html", out, 3200, h + 20, work)
            shots[kind] = np.asarray(Image.open(out).convert("L")).astype(float)
        print(browser)
        y = 0
        for s in INK_SIZES:
            old = new = 0.0
            for _ in INK_LINES:
                old += shots["old"][y:y + INK_ROW[s]].sum()
                new += shots["new"][y:y + INK_ROW[s]].sum()
                y += INK_ROW[s]
            print(f"   {s:6}px  new/old ink = {new / old:.3f}")


def copies(work, base):
    """A = the site at `base`, B = the working tree; both get the probe page"""
    for name in ("A", "B"):
        shutil.rmtree(os.path.join(work, name), ignore_errors=True)
    os.makedirs(os.path.join(work, "A"))
    archive = subprocess.run(["git", "-C", ROOT, "archive", base], capture_output=True, check=True).stdout
    subprocess.run(["tar", "-x", "-C", os.path.join(work, "A")], input=archive, check=True)
    shutil.copytree(ROOT, os.path.join(work, "B"), ignore=shutil.ignore_patterns(".git", ".DS_Store", "__pycache__"))
    for name in ("A", "B"):
        shutil.copy(os.path.join(HERE, "probe.html"), os.path.join(work, name, "probe.html"))


def probe(browser, site, page, w, h, work, n=[0]):
    n[0] += 1
    key = f"{browser}{int(time.time())}_{n[0]}"
    url = f"http://127.0.0.1:{PORT}/{site}/probe.html?w={w}&h={h}&key={key}&page=/{site}{page}"
    if browser == "chrome":
        out = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--force-device-scale-factor=1", f"--window-size={w + 40},{h + 200}",
                              "--virtual-time-budget=12000", "--dump-dom", url], capture_output=True, text=True, timeout=180).stdout
        return json.loads(html.unescape(re.search(r'<pre id="out">(.*?)</pre>', out, re.S).group(1)))
    screenshot("firefox", url, os.path.join(work, "probe.png"), w + 40, h + 200, work)
    with open(os.path.join(work, "reports", key + ".json")) as f:
        return json.load(f)


def layout(work, cross):
    names = ("chrome", "firefox") if cross else ("base", "new")
    worst = 0.0
    for page in PAGES:
        for w, h in VIEWS:
            if cross:
                a, b = probe("chrome", "B", page, w, h, work), probe("firefox", "B", page, w, h, work)
            else:
                a, b = probe("chrome", "A", page, w, h, work), probe("chrome", "B", page, w, h, work)
            diffs = []
            for x, y in zip(a["rows"], b["rows"]):
                if x != y:
                    d = max(abs(float(p) - float(q)) for p, q in zip(x.split("|")[3:], y.split("|")[3:]))
                    diffs.append((d, x, y))
            diffs.sort(reverse=True)
            biggest = diffs[0][0] if diffs else 0.0
            worst = max(worst, biggest)
            print(f"{page:26s} {w}x{h}: {len(a['rows'])} elements, {len(diffs)} differ, max {biggest:.2f}px, "
                  f"overflowing fields in {names[1]}: {b.get('over') or 'none'}")
            for d, x, y in diffs[:3]:
                print(f"     {names[0]:8s} {x}\n     {names[1]:8s} {y}")
    print(f"worst difference {worst:.2f}px")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("what", choices=["ink", "layout"])
    ap.add_argument("--cross", action="store_true")
    ap.add_argument("--base", default="master")
    ap.add_argument("--font", default=os.path.join(ROOT, "DDGeo.woff2"))
    ap.add_argument("--work")
    args = ap.parse_args()
    work = args.work or tempfile.mkdtemp(prefix="ddgeo-check-")
    os.makedirs(os.path.join(work, "ffprofile"), exist_ok=True)
    server = serve(work, os.path.join(work, "reports"))
    try:
        if args.what == "ink":
            ink(work, args.font)
        else:
            copies(work, args.base)
            layout(work, args.cross)
    finally:
        server.shutdown()
    print("files in", work, file=sys.stderr)


if __name__ == "__main__":
    main()
