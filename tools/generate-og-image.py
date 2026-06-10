#!/usr/bin/env python3
# توليد صورة المشاركة النقطية og.png (1200×630) من نفس تصميم og.svg.
# نسخة نقطية مطلوبة لأن منصّات التواصل ومقاطع Google الغنية لا تدعم SVG.
#
# المتطلّبات (للتطوير فقط، ليست جزءاً من نشر الموقع):
#   pip install Pillow            # يجب أن يكون مبنيّاً مع raqm لتشكيل العربية
#   خطوط النظام: fonts-noto-core (NotoSansArabic) + fonts-noto-color-emoji + fonts-dejavu
# التشغيل:  python3 tools/generate-og-image.py   →  ينتج og.png في جذر المشروع

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
AR_BOLD = "/usr/share/fonts/truetype/noto/NotoSansArabic-Bold.ttf"
AR_REG = "/usr/share/fonts/truetype/noto/NotoSansArabic-Regular.ttf"
LAT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
EMOJI = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"
OUT = os.path.join(os.path.dirname(__file__), "..", "og.png")


def font(path, size):
    return ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)


def build():
    # تدرّج عمودي: بنفسجي #7c5fe6 ← وردي #ff6fb5
    top, bot = (0x7C, 0x5F, 0xE6), (0xFF, 0x6F, 0xB5)
    col = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / (H - 1)
        col.putpixel((0, y), tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    img = col.resize((W, H))
    d = ImageDraw.Draw(img)

    def fit(path, text, size, maxw):
        f = font(path, size)
        while d.textlength(text, font=f) > maxw and size > 12:
            size -= 2
            f = font(path, size)
        return f

    def center(y, text, path, size, fill, maxw=1080):
        d.text((W / 2, y), text, font=fit(path, text, size, maxw), fill=fill, anchor="mm")

    center(120, "عالم الاستكشاف السحري", AR_BOLD, 72, "#ffffff")
    center(430, "تطبيق مغامرات تعليمي للأطفال من ٣ إلى ٦ سنوات", AR_BOLD, 52, "#fff8e6")
    center(500, "حروف، أرقام، قراءة، ألعاب، مع صديقهم ميزو", AR_REG, 40, "#ffffff")
    center(575, "mykid.oscardevs.com", LAT_BOLD, 32, "#ffe6f3")

    # سطر الإيموجي عبر NotoColorEmoji (حجم نقطي ثابت 109) ثم تصغيره
    ef = ImageFont.truetype(EMOJI, 109)
    tmp = Image.new("RGBA", (900, 200), (0, 0, 0, 0))
    ImageDraw.Draw(tmp).text((450, 100), "🦁  🧒  ⭐", font=ef, fill="#ffffff",
                             anchor="mm", embedded_color=True)
    emi = tmp.crop(tmp.getbbox())
    emi = emi.resize((int(emi.width * 150 / emi.height), 150))
    img.paste(emi, (int((W - emi.width) / 2), 215), emi)

    img.save(OUT)
    print("saved", os.path.abspath(OUT), img.size)


if __name__ == "__main__":
    build()
