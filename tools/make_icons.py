"""Draw the Frostpeak Mail toolbar/store icons.

A dark diamond (the same gem shape as the UI ornaments) framing a frosted peak over a line of fog.
Drawn once at 1024px and downsampled, so every size stays crisp. Output: icons/icon{16,32,48,128}.png

    python tools/make_icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
S = 1024                      # master canvas; Chrome wants 96px of art inside 128, i.e. 128..896 here
C = S // 2

NIGHT = (21, 24, 27, 255)
BONE = (214, 208, 192, 255)
FROST = (226, 232, 234, 255)
STONE = (104, 110, 111, 255)


def diamond(r):
    return [(C, C - r), (C + r, C), (C, C + r), (C - r, C)]


def draw(small=False):
    """small=True fills the whole square and drops the fine lines, for the 16/32px toolbar sizes."""
    k = 496 / 384 if small else 1          # scale everything up around the centre
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    P = lambda pts: [(C + (x - C) * k, C + (y - C) * k) for x, y in pts]
    outer = diamond(round(384 * k) - (24 if small else 0))
    d.polygon(outer, fill=NIGHT)
    d.line(outer + [outer[0]], fill=BONE, width=48 if small else 30, joint="curve")
    if not small:
        d.line(diamond(326) + [diamond(326)[0]], fill=BONE[:3] + (110,), width=10, joint="curve")

    # back ridge, then the frosted peak in front
    d.polygon(P([(440, 650), (612, 440), (752, 650)]), fill=STONE)
    d.polygon(P([(272, 650), (470, 338), (668, 650)]), fill=FROST)
    # snow line: a jagged edge across the front peak, the rock below it a shade darker
    if not small:
        d.polygon([(339, 545), (390, 520), (430, 560), (470, 515), (515, 556), (552, 522), (602, 545),
                   (668, 650), (272, 650)], fill=(160, 168, 170, 255))

    # fog line under the peaks
    if not small:
        d.line([(318, 700), (706, 700)], fill=BONE[:3] + (150,), width=14)
    return img


def main():
    out = ROOT / "icons"
    out.mkdir(exist_ok=True)
    full, small = draw(), draw(small=True)
    for size in (16, 32, 48, 128):
        master = small if size <= 32 else full
        master.resize((size, size), Image.LANCZOS).save(out / f"icon{size}.png")
        print("wrote", out / f"icon{size}.png")


if __name__ == "__main__":
    main()
