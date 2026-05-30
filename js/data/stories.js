// ===== قصص تفاعلية قصيرة =====
// كل قصة: { id, title, emoji, region, scenes:[{emoji, text}] }
// المشاهد تُعرض واحداً تلو الآخر وتُنطق عبر Speech الموجود.
export const STORIES = [
  {
    id: "lion-friend",
    title: "الأسد والصديق الصغير",
    emoji: "🦁",
    region: "animals",
    scenes: [
      { emoji: "🦁", text: "كان هناك أسدٌ كبيرٌ يعيش في الغابة." },
      { emoji: "🐭", text: "وجد فأراً صغيراً خائفاً تحت شجرة." },
      { emoji: "🤝", text: "قال الأسد: لا تخف يا صغيري، أنا صديقك." },
      { emoji: "🧀", text: "أحضر له الفأر قطعة جبن لذيذة شكراً له." },
      { emoji: "❤️", text: "ومن يومها صارا أعزّ صديقين في الغابة." },
    ],
  },
  {
    id: "apple-tree",
    title: "شجرة التفاح الكريمة",
    emoji: "🍎",
    region: "fruits",
    scenes: [
      { emoji: "🌳", text: "في المزرعة شجرة تفاحٍ كبيرةٌ وجميلة." },
      { emoji: "🍎", text: "أعطت تفاحةً حمراء لكل طفلٍ جائع." },
      { emoji: "👧", text: "أكلت سارة تفاحةً فصارت قويّةً وسعيدة." },
      { emoji: "🌱", text: "زرعت سارة البذور لتكبر أشجارٌ جديدة." },
      { emoji: "🍏", text: "وبعد أيام، نبتت شجرةٌ صغيرةٌ خضراء." },
    ],
  },
  {
    id: "count-stars",
    title: "النجوم الخمس",
    emoji: "⭐",
    region: "numbers",
    scenes: [
      { emoji: "🌙", text: "في الليل، نظر القمر إلى السماء." },
      { emoji: "⭐", text: "ظهرت نجمةٌ واحدةٌ تلمع بنور جميل." },
      { emoji: "✨", text: "ثم ظهرت نجمتان، فثلاثٌ، فأربع." },
      { emoji: "🌟", text: "وأخيراً صارت خمس نجماتٍ تعدّها معاً." },
      { emoji: "😴", text: "نام الأطفال وهم يعدّون النجوم الخمس." },
    ],
  },
  {
    id: "brave-fish",
    title: "السمكة الشجاعة",
    emoji: "🐠",
    region: "fish",
    scenes: [
      { emoji: "🐠", text: "في البحر الأزرق سمكةٌ صغيرةٌ ملوّنة." },
      { emoji: "🌊", text: "أرادت أن تكتشف البحر الكبير وحدها." },
      { emoji: "🐙", text: "قابلت أخطبوطاً لطيفاً ساعدها في الطريق." },
      { emoji: "🐢", text: "وسبحت مع سلحفاةٍ هادئةٍ وبطيئة." },
      { emoji: "🏡", text: "ثم عادت إلى بيتها سعيدةً بمغامرتها." },
    ],
  },
];

export function getStory(id) {
  return STORIES.find((s) => s.id === id);
}
export function storiesForRegion(region) {
  return STORIES.filter((s) => s.region === region);
}
