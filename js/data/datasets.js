// ===== سجلّ مجموعات البيانات (لتمريرها للألعاب عبر مفتاح نصّي) =====
import { ARABIC_LETTERS } from "./arabicLetters.js";

const DATASETS = {
  arabic: {
    key: "arabic",
    lang: "ar-EG",
    glyphKind: "letter", // طريقة العرض
    items: ARABIC_LETTERS,
  },
  // english: ...  ← المرحلة الثالثة
  // numbers: ...  ← المرحلة الرابعة
};

export function getDataset(key) {
  return DATASETS[key];
}
