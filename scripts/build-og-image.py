#!/usr/bin/env python3
"""
Build og-image-v3.jpg from existing visual identity assets.

Backdrop: public/images/hero-bg-magenta-green.png (same as hero section).
Layout matches site hero — logo+wordmark top-left, headline filling the
canvas in SouvenirGothic Bold (heavy display weight).

Run:  python3 scripts/build-og-image.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BG_PATH = ROOT / "public/images/hero-bg-magenta-green.png"
HEADLINE_FONT = ROOT / "public/fonts/SouvenirGothic Bold.otf"   # display weight
WORDMARK_FONT = ROOT / "public/fonts/SouvenirGothic_Bold.otf"   # underscore variant
OUT_PATH = ROOT / "public/images/og-image-v3.jpg"

TARGET_W, TARGET_H = 1200, 630
TEXT_COLOR = (245, 242, 233)  # #F5F2E9, matches Logo Mark fill
HEADLINE_LINES = ["GTM strategy is not a set", "of tactics across channels"]
SIDE_PAD = 72


# Logo Mark = 6 vertical "soundbar" ellipses on 268×268 canvas.
# (cx, cy, rx, ry) extracted from path bbox of public/images/Logo Mark Light.svg
LOGO_MARK_ELLIPSES = [
    (259.65, 133.34,  7.53,  43.44),
    (229.00, 134.01,  4.30,  89.06),
    (197.13, 133.50,  4.42, 116.21),
    (159.00, 133.59, 11.84, 133.59),
    (111.16, 133.31, 17.22, 128.70),
    ( 37.66, 133.75, 37.66, 102.64),
]
LOGO_MARK_NATIVE_SIZE = 268


def load_backdrop():
    bg = Image.open(BG_PATH).convert("RGB")
    src_w, src_h = bg.size
    scale = TARGET_W / src_w
    new_h = int(src_h * scale)
    bg = bg.resize((TARGET_W, new_h), Image.LANCZOS)
    crop_top = max((new_h - TARGET_H) // 2, 0)
    return bg.crop((0, crop_top, TARGET_W, crop_top + TARGET_H))


def darken_overall(bg, max_alpha=80):
    """Soft global darken — improves text contrast across the whole image,
    not just the left third (headline now spans full width)."""
    overlay = Image.new("RGB", (TARGET_W, TARGET_H), (0, 0, 0))
    return Image.blend(bg, overlay, max_alpha / 255)


def draw_logo_mark(canvas, target_height, x, y, color):
    """Render the 6-ellipse soundbar mark scaled to target_height."""
    scale = target_height / LOGO_MARK_NATIVE_SIZE
    side = int(LOGO_MARK_NATIVE_SIZE * scale)
    icon = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    for cx, cy, rx, ry in LOGO_MARK_ELLIPSES:
        x0 = (cx - rx) * scale
        y0 = (cy - ry) * scale
        x1 = (cx + rx) * scale
        y1 = (cy + ry) * scale
        draw.ellipse([x0, y0, x1, y1], fill=color + (255,))
    canvas.paste(icon, (x, y), icon)
    return side


def draw_logo_top_left(bg):
    icon_size = 56
    icon_x = SIDE_PAD
    icon_y = 48
    draw_logo_mark(bg, icon_size, icon_x, icon_y, TEXT_COLOR)
    # Wordmark right of icon, two-line stack
    draw = ImageDraw.Draw(bg)
    font = ImageFont.truetype(str(WORDMARK_FONT), 24)
    text_x = icon_x + icon_size + 18
    line_h = 28
    text_y = icon_y + 2
    draw.text((text_x, text_y), "Backspace", fill=TEXT_COLOR, font=font)
    draw.text((text_x, text_y + line_h), "Oddity", fill=TEXT_COLOR, font=font)
    return bg


def fit_headline(draw, lines, font_path, max_width, start_size=140, min_size=48):
    """Bisect-fit: find largest font size where every line fits in max_width."""
    size = start_size
    while size > min_size:
        font = ImageFont.truetype(str(font_path), size)
        widest = max(draw.textbbox((0, 0), line, font=font)[2] for line in lines)
        if widest <= max_width:
            return font, size
        size -= 2
    return ImageFont.truetype(str(font_path), min_size), min_size


def draw_headline(bg):
    draw = ImageDraw.Draw(bg)
    max_w = TARGET_W - SIDE_PAD * 2
    font, size = fit_headline(draw, HEADLINE_LINES, HEADLINE_FONT, max_w)
    line_h = int(size * 1.05)
    total_h = line_h * len(HEADLINE_LINES)
    # Vertically centered, slightly biased downward to leave room above for logo
    y = (TARGET_H - total_h) // 2 + 30
    for line in HEADLINE_LINES:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_w = bbox[2] - bbox[0]
        x = (TARGET_W - line_w) // 2
        draw.text((x, y), line, fill=TEXT_COLOR, font=font)
        y += line_h
    return bg, size


def main():
    print(f"loading backdrop: {BG_PATH.name}")
    bg = load_backdrop()
    print("applying global darken")
    bg = darken_overall(bg)

    print("rendering logo + wordmark top-left")
    draw_logo_top_left(bg)

    print(f"drawing full-width heavy headline ({len(HEADLINE_LINES)} lines)")
    bg, headline_size = draw_headline(bg)
    print(f"  fitted font size: {headline_size}pt")

    print(f"saving: {OUT_PATH.relative_to(ROOT)}")
    bg.save(OUT_PATH, "JPEG", quality=88, optimize=True)
    print(f"  bytes: {OUT_PATH.stat().st_size:,}")


if __name__ == "__main__":
    main()
