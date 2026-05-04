#!/usr/bin/env python3
"""
Build og-image-v3.jpg from existing visual identity assets.

Backdrop: public/images/hero-bg-magenta-green.png (same as hero section).
Overlay: GTM thesis copy (SouvenirGothic Medium) + Backspace Oddity workmark.
Output: public/images/og-image-v3.jpg (1200x630, OG standard).

Run:  python3 scripts/build-og-image.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BG_PATH = ROOT / "public/images/hero-bg-magenta-green.png"
FONT_PATH = ROOT / "public/fonts/SouvenirGothic-Medium.otf"
WORDMARK_FONT_PATH = ROOT / "public/fonts/SouvenirGothic_Bold.otf"
OUT_PATH = ROOT / "public/images/og-image-v3.jpg"

TARGET_W, TARGET_H = 1200, 630
HEADLINE = ["GTM strategy", "is not a set of", "tactics across", "channels."]
TEXT_COLOR = (245, 240, 232)  # warm off-white
HEADLINE_SIZE = 68
LINE_HEIGHT = 1.15
LEFT_PAD = 72
TOP_PAD_HEADLINE = 150


def load_backdrop():
    bg = Image.open(BG_PATH).convert("RGB")
    src_w, src_h = bg.size
    # Scale so width = TARGET_W, then center-crop vertically
    scale = TARGET_W / src_w
    new_h = int(src_h * scale)
    bg = bg.resize((TARGET_W, new_h), Image.LANCZOS)
    crop_top = max((new_h - TARGET_H) // 2, 0)
    bg = bg.crop((0, crop_top, TARGET_W, crop_top + TARGET_H))
    return bg


def darken_left_gradient(bg, max_alpha=110, falloff=1.4):
    """Vignette darker on left where text will sit."""
    overlay = Image.new("RGB", (TARGET_W, TARGET_H), (0, 0, 0))
    mask = Image.new("L", (TARGET_W, TARGET_H), 0)
    pixels = mask.load()
    for x in range(TARGET_W):
        a = int(max_alpha * max(0.0, 1.0 - (x / TARGET_W) * falloff))
        for y in range(TARGET_H):
            pixels[x, y] = a
    return Image.composite(overlay, bg, mask)


def draw_headline(bg):
    draw = ImageDraw.Draw(bg)
    font = ImageFont.truetype(str(FONT_PATH), HEADLINE_SIZE)
    line_h = int(HEADLINE_SIZE * LINE_HEIGHT)
    y = TOP_PAD_HEADLINE
    for line in HEADLINE:
        draw.text((LEFT_PAD, y), line, fill=TEXT_COLOR, font=font)
        y += line_h
    return bg


def paste_wordmark(bg):
    """Render 'Backspace Oddity' text wordmark top-right in SouvenirGothic Bold.

    Two-line stack (matches site nav pattern: 'Backspace' / 'Oddity'),
    flush right, white-cream color.
    """
    draw = ImageDraw.Draw(bg)
    font = ImageFont.truetype(str(WORDMARK_FONT_PATH), 28)
    line1 = "Backspace"
    line2 = "Oddity"
    # Right-align both lines
    bbox1 = draw.textbbox((0, 0), line1, font=font)
    bbox2 = draw.textbbox((0, 0), line2, font=font)
    w1 = bbox1[2] - bbox1[0]
    w2 = bbox2[2] - bbox2[0]
    right_edge = TARGET_W - 60
    line_h = 34
    y0 = 56
    draw.text((right_edge - w1, y0), line1, fill=TEXT_COLOR, font=font)
    draw.text((right_edge - w2, y0 + line_h), line2, fill=TEXT_COLOR, font=font)
    return bg


def main():
    print(f"loading backdrop: {BG_PATH.name}")
    bg = load_backdrop()
    print(f"  size after crop: {bg.size}")

    print("applying left-gradient darken")
    bg = darken_left_gradient(bg)

    print(f"drawing headline: {' '.join(HEADLINE)}")
    bg = draw_headline(bg)

    print("rendering wordmark top-right")
    bg = paste_wordmark(bg)

    print(f"saving: {OUT_PATH.relative_to(ROOT)}")
    bg.save(OUT_PATH, "JPEG", quality=88, optimize=True)
    print(f"  bytes: {OUT_PATH.stat().st_size:,}")


if __name__ == "__main__":
    main()
