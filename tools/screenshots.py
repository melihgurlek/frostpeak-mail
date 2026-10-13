"""Render the store screenshots from dev/showcase.html with headless Chrome.

Starts a local server for the repo, opens each view at exactly 1280x800 in a throwaway profile,
and writes dist/screenshots/<n>-<view>.png. No real mail is involved.

    python tools/screenshots.py
"""
import functools
import http.server
import os
import shutil
import subprocess
import tempfile
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIEWS = ["inbox", "read", "paper", "compose"]
CANDIDATES = [
    os.environ.get("CHROME", ""),
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    shutil.which("google-chrome") or "",
    shutil.which("chromium") or "",
]


def main():
    chrome = next((c for c in CANDIDATES if c and Path(c).exists()), None)
    if not chrome:
        raise SystemExit("Chrome not found; set the CHROME environment variable to its path")

    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass
    handler = functools.partial(Quiet, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    port = server.server_address[1]

    out = ROOT / "dist" / "screenshots"
    out.mkdir(parents=True, exist_ok=True)
    try:
        for i, view in enumerate(VIEWS, 1):
            target = out / f"{i}-{view}.png"
            with tempfile.TemporaryDirectory() as profile:
                subprocess.run([
                    chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                    f"--user-data-dir={profile}", "--window-size=1280,800", "--force-device-scale-factor=1",
                    "--virtual-time-budget=2500", f"--screenshot={target}",
                    f"http://127.0.0.1:{port}/dev/showcase.html?shot={i}#{view}",
                ], check=True, capture_output=True, timeout=60)
            print("wrote", target.relative_to(ROOT))
    finally:
        server.shutdown()


if __name__ == "__main__":
    main()
