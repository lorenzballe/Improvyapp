#!/usr/bin/env python3
"""Rewrites the status line at the bottom of the link-preview image.

`public/og-image.png` is what WhatsApp, iMessage, Slack and every other
unfurler shows when the site is shared. Its bottom line said COMING SOON long
after the app shipped, and there is no source file to regenerate the image
from — so this edits the line in place and leaves the rest of the artwork
untouched.

    python3 tools/og_status_line.py "OUT NOW  |  iOS & ANDROID"

The old line is erased by rebuilding the background *vertically*: for each
column, the pixels across the strip are interpolated between one clean row
above it and one clean row below. The backdrop is a pair of wide, soft glows,
so over a 30px span that is accurate to a single level out of 255 — invisible.
(Interpolating horizontally instead is off by 7 and leaves a visible band: the
gradient runs left-to-right and is nowhere near linear across 600px.)
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
IMAGE = ROOT.parent / "public" / "og-image.png"
FONT = ROOT / "Outfit-SemiBold.ttf"

# Measured off the artwork, not guessed.
STRIP_TOP, STRIP_BOTTOM = 471, 501  # rows the old line occupies
CLEAN_ABOVE, CLEAN_BELOW = 470, 502  # the rows either side, still background
LEFT, RIGHT = 415, 1010  # columns to rebuild
TEXT_LEFT, CAP_TOP = 421, 475  # where the line starts, and its cap height
CAP_HEIGHT = 20
COLOR = (150, 150, 165)
TRACKING = 2.4  # px between glyphs, matching the original's wide setting


def erase(im: Image.Image) -> None:
    px = im.load()
    span = CLEAN_BELOW - CLEAN_ABOVE
    for x in range(LEFT, RIGHT + 1):
        top, bottom = px[x, CLEAN_ABOVE], px[x, CLEAN_BELOW]
        for y in range(STRIP_TOP, STRIP_BOTTOM + 1):
            t = (y - CLEAN_ABOVE) / span
            px[x, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))


def fitted_font() -> ImageFont.FreeTypeFont:
    """The size whose capitals are exactly as tall as the ones being replaced."""
    for size in range(16, 48):
        f = ImageFont.truetype(str(FONT), size)
        box = f.getbbox("H")
        if box[3] - box[1] >= CAP_HEIGHT:
            return f
    raise SystemExit("no size matched the cap height")


def draw(im: Image.Image, text: str) -> None:
    font = fitted_font()
    d = ImageDraw.Draw(im)
    # Letter-spacing means drawing glyph by glyph; anchor each on the cap line
    # so the row sits exactly where the old one did.
    x = float(TEXT_LEFT)
    top_of_H = font.getbbox("H")[1]
    for ch in text:
        d.text((x, CAP_TOP - top_of_H), ch, font=font, fill=COLOR)
        x += d.textlength(ch, font=font) + TRACKING
    print(f"line ends at x={round(x - TRACKING)} (image is {im.width} wide)")


def main() -> None:
    text = sys.argv[1] if len(sys.argv) > 1 else "OUT NOW  |  iOS & ANDROID"
    im = Image.open(IMAGE).convert("RGB")
    erase(im)
    draw(im, text)
    im.save(IMAGE)
    print(f"wrote {IMAGE.relative_to(ROOT.parent)}: {text!r}")


if __name__ == "__main__":
    main()
