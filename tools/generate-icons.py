#!/usr/bin/env python3
# توليد أيقونات الـ PWA النقطية من نفس تصميم أيقونة الـ manifest (مربع بنفسجي مستدير + 🦁).
# مطلوبة لأن معايير التثبيت (Chrome/Edge) تشترط PNG بمقاسي 192 و512، وiOS يحتاج apple-touch-icon.
#
# المتطلّبات كما في generate-og-image.py (Pillow + fonts-noto-color-emoji).
# التشغيل:  python3 tools/generate-icons.py   →  ينتج الأيقونات في جذر المشروع.

from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
EMOJI = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
BG = "#5b3fb5"


def lion(height):
    # NotoColorEmoji خط نقطي بحجم ثابت 109؛ نرسمه ثم نغيّر مقاسه
    f = ImageFont.truetype(EMOJI, 109)
    tmp = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    ImageDraw.Draw(tmp).text((100, 100), "🦁", font=f, anchor="mm", embedded_color=True)
    em = tmp.crop(tmp.getbbox())
    return em.resize((int(em.width * height / em.height), height), Image.LANCZOS)


def icon(size, radius_ratio, lion_ratio, name):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size, size], radius=int(size * radius_ratio), fill=BG)
    em = lion(int(size * lion_ratio))
    img.paste(em, (int((size - em.width) / 2), int((size - em.height) / 2)), em)
    out = os.path.join(ROOT, name)
    img.convert("RGB" if name == "apple-touch-icon.png" else "RGBA").save(out)
    print("saved", name, img.size)


if __name__ == "__main__":
    icon(192, 0.22, 0.62, "icon-192.png")
    icon(512, 0.22, 0.62, "icon-512.png")
    # maskable: خلفية كاملة بلا استدارة، والرمز داخل منطقة الأمان (~62%)
    icon(512, 0.0, 0.55, "icon-512-maskable.png")
    # iOS يضيف الاستدارة بنفسه؛ خلفية كاملة
    icon(180, 0.0, 0.62, "apple-touch-icon.png")
