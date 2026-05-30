// ===== سجلّ مجموعات البيانات (لتمريرها للألعاب عبر مفتاح نصّي) =====
import { ARABIC_LETTERS } from "./arabicLetters.js";
import { ENGLISH_LETTERS } from "./englishLetters.js";

const DATASETS = {
  arabic: {
    key: "arabic",
    lang: "ar-EG",
    glyphKind: "letter", // طريقة العرض
    items: ARABIC_LETTERS,
  },
  english: {
    key: "english",
    lang: "en-US",
    glyphKind: "letter",
    items: ENGLISH_LETTERS,
  },
  // numbers: ...  ← المرحلة الرابعة
};

export function getDataset(key) {
  return DATASETS[key];
}
