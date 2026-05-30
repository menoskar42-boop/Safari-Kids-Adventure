// ===== تعريف مناطق العالم السحري =====
// كل منطقة لها: معرّف، اسم عربي/إنجليزي، إيموجي، لون خلفية، ورسالة المرشد.
// "ready" تعني أن محتوى المنطقة جاهز (يُفعّل تدريجياً مع كل مرحلة تطوير).

export const REGIONS = [
  {
    id: "arabic",
    name: "قلعة الحروف العربية",
    nameEn: "Arabic Letters",
    emoji: "🔤",
    bg: "bg-arabic",
    guide: "هيا نتعلّم الحروف العربية ونجمع النجوم!",
    ready: true,
  },
  {
    id: "english",
    name: "قلعة الحروف الإنجليزية",
    nameEn: "English Letters",
    emoji: "🔠",
    bg: "bg-english",
    guide: "Let's learn English letters together!",
    ready: true,
  },
  {
    id: "numbers",
    name: "مدينة الأرقام",
    nameEn: "Numbers City",
    emoji: "🔢",
    bg: "bg-numbers",
    guide: "تعال نعدّ معاً ونلعب بالأرقام!",
    ready: true,
  },
  {
    id: "animals",
    name: "غابة الحيوانات",
    nameEn: "Animals Forest",
    emoji: "🦁",
    bg: "bg-animals",
    guide: "أصدقاؤنا الحيوانات في انتظارك!",
    ready: true,
  },
  {
    id: "fish",
    name: "بحر الأسماك",
    nameEn: "Fish Sea",
    emoji: "🐠",
    bg: "bg-fish",
    guide: "هيا نغوص في البحر ونكتشف الأسماك!",
    ready: true,
  },
  {
    id: "birds",
    name: "عالم الطيور",
    nameEn: "Birds World",
    emoji: "🦜",
    bg: "bg-birds",
    guide: "الطيور تطير في السماء، تعال نراها!",
    ready: true,
  },
  {
    id: "fruits",
    name: "مزرعة الفواكه",
    nameEn: "Fruits Farm",
    emoji: "🍎",
    bg: "bg-fruits",
    guide: "سوق الفواكه السحري ينتظرك!",
    ready: true,
  },
  {
    id: "colors",
    name: "حديقة الألوان",
    nameEn: "Colors Garden",
    emoji: "🎨",
    bg: "bg-colors",
    guide: "تعال نلعب بكل الألوان الجميلة!",
    ready: true,
  },
  {
    id: "shapes",
    name: "عالم الأشكال",
    nameEn: "Shapes World",
    emoji: "⭐",
    bg: "bg-shapes",
    guide: "أشكال كثيرة تنتظر أن تكتشفها!",
    ready: true,
  },
  {
    id: "jobs",
    name: "مدينة المهن",
    nameEn: "Jobs City",
    emoji: "👨‍🚒",
    bg: "bg-jobs",
    guide: "تعال نتعرّف على المهن ومن يساعدنا كل يوم!",
    ready: true,
  },
  {
    id: "body",
    name: "جسم الإنسان",
    nameEn: "My Body",
    emoji: "🧍",
    bg: "bg-body",
    guide: "تعال نتعرّف على أجزاء جسمنا!",
    ready: true,
  },
];

export function getRegion(id) {
  return REGIONS.find((r) => r.id === id);
}
