// ===== سجلّ مجموعات البيانات (لتمريرها للألعاب عبر مفتاح نصّي) =====
import { ARABIC_LETTERS } from "./arabicLetters.js";
import { ENGLISH_LETTERS } from "./englishLetters.js";
import { ANIMALS } from "./animals.js";

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
  animals: { key: "animals", lang: "ar-EG", glyphKind: "emoji", items: ANIMALS },
};

export function getDataset(key) {
  return DATASETS[key];
}
