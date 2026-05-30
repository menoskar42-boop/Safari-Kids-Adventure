// ===== سجلّ مجموعات البيانات (لتمريرها للألعاب عبر مفتاح نصّي) =====
import { ARABIC_LETTERS } from "./arabicLetters.js";
import { ENGLISH_LETTERS } from "./englishLetters.js";
import { ANIMALS } from "./animals.js";
import { FISH } from "./fish.js";
import { BIRDS } from "./birds.js";
import { FRUITS } from "./fruits.js";
import { COLORS } from "./colors.js";
import { SHAPES } from "./shapes.js";
import { JOBS } from "./jobs.js";
import { BODY_PARTS } from "./body.js";
import { TRANSPORT } from "./transport.js";
import { FOOD } from "./food.js";
import { WEEKDAYS } from "./weekdays.js";
import { OPPOSITES_FLAT } from "./opposites.js";
import { WORDS } from "./words.js";

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
  fish: { key: "fish", lang: "ar-EG", glyphKind: "emoji", items: FISH },
  birds: { key: "birds", lang: "ar-EG", glyphKind: "emoji", items: BIRDS },
  fruits: { key: "fruits", lang: "ar-EG", glyphKind: "emoji", items: FRUITS },
  colors: { key: "colors", lang: "ar-EG", glyphKind: "emoji", items: COLORS },
  shapes: { key: "shapes", lang: "ar-EG", glyphKind: "emoji", items: SHAPES },
  jobs: { key: "jobs", lang: "ar-EG", glyphKind: "emoji", items: JOBS },
  body: { key: "body", lang: "ar-EG", glyphKind: "emoji", items: BODY_PARTS },
  transport: { key: "transport", lang: "ar-EG", glyphKind: "emoji", items: TRANSPORT },
  food: { key: "food", lang: "ar-EG", glyphKind: "emoji", items: FOOD },
  weekdays: { key: "weekdays", lang: "ar-EG", glyphKind: "emoji", items: WEEKDAYS },
  opposites: { key: "opposites", lang: "ar-EG", glyphKind: "emoji", items: OPPOSITES_FLAT },
  words: { key: "words", lang: "ar-EG", glyphKind: "emoji", items: WORDS },
};

export function getDataset(key) {
  return DATASETS[key];
}
