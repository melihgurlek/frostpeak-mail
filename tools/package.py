"""Build the Chrome Web Store upload: dist/frostpeak-mail-<version>.zip

Only what the extension needs at runtime goes in; dev/, tools/, docs and git files stay out.

    python tools/package.py
"""
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INCLUDE = [
    "manifest.json", "content.js", "skin.css", "i18n.js",
    "popup.html", "popup.js", "options.html", "options.js",
    "LICENSE", "_locales", "icons", "fonts",
]


def main():
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    out = ROOT / "dist" / f"frostpeak-mail-{manifest['version']}.zip"
    out.parent.mkdir(exist_ok=True)

    files = []
    for name in INCLUDE:
        path = ROOT / name
        if not path.exists():
            raise SystemExit(f"missing: {name}")
        files += sorted(p for p in path.rglob("*") if p.is_file()) if path.is_dir() else [path]

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for f in files:
            z.write(f, f.relative_to(ROOT).as_posix())

    print(f"{out.relative_to(ROOT)}  ({len(files)} files, {out.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
