// ===== تعريف أنشطة كل منطقة =====
// يُملأ تدريجياً مع كل مرحلة تطوير. المفتاح = معرّف المنطقة.
// كل نشاط: { emoji, title, desc, screen, params }
export const ACTIVITIES = {
  arabic: [
    {
      emoji: "🎓",
      title: "تعرّف على الحروف",
      desc: "اسمع الحرف واضغط على الكلمة",
      screen: "learn",
      params: { datasetKey: "arabic", lang: "ar-EG" },
    },
    {
      emoji: "🎯",
      title: "اصطياد الحروف",
      desc: "اصطد ما يبدأ بالحرف المطلوب",
      screen: "catch",
      params: { datasetKey: "arabic", lang: "ar-EG" },
    },
    {
      emoji: "✏️",
      title: "ارسم الحرف",
      desc: "تتبّع الحرف بإصبعك",
      screen: "trace",
      params: { datasetKey: "arabic", lang: "ar-EG" },
    },
  ],
  english: [
    {
      emoji: "🎓",
      title: "تعرّف على الحروف",
      desc: "Listen and tap the word",
      screen: "learn",
      params: { datasetKey: "english", lang: "en-US" },
    },
    {
      emoji: "🎯",
      title: "اصطياد الحروف",
      desc: "Catch what starts with the letter",
      screen: "catch",
      params: { datasetKey: "english", lang: "en-US" },
    },
    {
      emoji: "✏️",
      title: "ارسم الحرف",
      desc: "Trace the letter",
      screen: "trace",
      params: { datasetKey: "english", lang: "en-US" },
    },
  ],
  numbers: [
    {
      emoji: "🔢",
      title: "تعرّف على الأرقام",
      desc: "اسمع الرقم وعُدّ معه",
      screen: "countLearn",
      params: {},
    },
    {
      emoji: "🍌",
      title: "أطعم الصديق",
      desc: "أعطِ الحيوان العدد المطلوب",
      screen: "feed",
      params: {},
    },
    {
      emoji: "⭐",
      title: "اجمع الكنوز",
      desc: "اجمع العدد المطلوب من النجوم",
      screen: "collect",
      params: {},
    },
  ],
  animals: [
    {
      emoji: "🦁",
      title: "استكشف الحيوانات",
      desc: "اضغط على كل حيوان ليتكلّم",
      screen: "explore",
      params: { datasetKey: "animals", title: "🦁 غابة الحيوانات", sound: true },
    },
    {
      emoji: "🌑",
      title: "طابق الظل",
      desc: "اعرف الحيوان من ظله",
      screen: "shadowMatch",
      params: { datasetKey: "animals", title: "🌑 ظل الحيوان", bg: "linear-gradient(180deg,#c7f0d0,#7fd99b)" },
    },
    {
      emoji: "🔊",
      title: "أصوات الحيوانات",
      desc: "من صاحب هذا الصوت؟",
      screen: "soundMatch",
      params: { datasetKey: "animals", title: "🔊 أصوات الحيوانات", bg: "linear-gradient(180deg,#c7f0d0,#7fd99b)" },
    },
  ],
  fish: [
    { emoji: "🐠", title: "استكشف البحر", desc: "اضغط على كل سمكة لتعرفها", screen: "explore",
      params: { datasetKey: "fish", title: "🐠 بحر الأسماك", bg: "linear-gradient(180deg,#7fe0ff,#1aa7ff)" } },
    { emoji: "🎣", title: "اصطد السمكة", desc: "اصطد السمكة المطلوبة", screen: "findIt",
      params: { datasetKey: "fish", title: "🎣 اصطياد السمك", verb: "اصطد", bg: "linear-gradient(180deg,#7fe0ff,#1aa7ff)" } },
    { emoji: "🌑", title: "طابق الظل", desc: "اعرف السمكة من ظلها", screen: "shadowMatch",
      params: { datasetKey: "fish", title: "🌑 ظل السمكة", bg: "linear-gradient(180deg,#7fe0ff,#1aa7ff)" } },
  ],
  birds: [
    { emoji: "🦜", title: "استكشف الطيور", desc: "اضغط على كل طائر لتعرفه", screen: "explore",
      params: { datasetKey: "birds", title: "🦜 عالم الطيور", bg: "linear-gradient(180deg,#cdb8ff,#8a6bff)" } },
    { emoji: "🔎", title: "جِد الطائر", desc: "اضغط على الطائر المطلوب", screen: "findIt",
      params: { datasetKey: "birds", title: "🔎 جِد الطائر", verb: "اضغط على", bg: "linear-gradient(180deg,#cdb8ff,#8a6bff)" } },
    { emoji: "🌑", title: "طابق الظل", desc: "اعرف الطائر من ظله", screen: "shadowMatch",
      params: { datasetKey: "birds", title: "🌑 ظل الطائر", bg: "linear-gradient(180deg,#cdb8ff,#8a6bff)" } },
  ],
  fruits: [
    { emoji: "🍎", title: "سوق الفواكه", desc: "اضغط على كل فاكهة لتعرفها", screen: "explore",
      params: { datasetKey: "fruits", title: "🍎 مزرعة الفواكه", bg: "linear-gradient(180deg,#ffc2d6,#ff6f9c)" } },
    { emoji: "🧺", title: "أحضِر الفاكهة", desc: "أحضِر الفاكهة المطلوبة", screen: "findIt",
      params: { datasetKey: "fruits", title: "🧺 أحضِر الفاكهة", verb: "أحضِر", bg: "linear-gradient(180deg,#ffc2d6,#ff6f9c)" } },
    { emoji: "🌑", title: "طابق الظل", desc: "اعرف الفاكهة من ظلها", screen: "shadowMatch",
      params: { datasetKey: "fruits", title: "🌑 ظل الفاكهة", bg: "linear-gradient(180deg,#ffc2d6,#ff6f9c)" } },
  ],
  colors: [
    { emoji: "🎨", title: "استكشف الألوان", desc: "اضغط على كل لون لتعرفه", screen: "explore",
      params: { datasetKey: "colors", title: "🎨 حديقة الألوان", bg: "linear-gradient(180deg,#ffe29a,#ff9a6c)" } },
    { emoji: "🔎", title: "جِد اللون", desc: "اضغط على اللون المطلوب", screen: "findIt",
      params: { datasetKey: "colors", title: "🔎 جِد اللون", verb: "اضغط على", bg: "linear-gradient(180deg,#ffe29a,#ff9a6c)" } },
  ],
  shapes: [
    { emoji: "⭐", title: "استكشف الأشكال", desc: "اضغط على كل شكل لتعرفه", screen: "explore",
      params: { datasetKey: "shapes", title: "⭐ عالم الأشكال", bg: "linear-gradient(180deg,#7ff0e6,#14b8a8)" } },
    { emoji: "🔎", title: "جِد الشكل", desc: "اضغط على الشكل المطلوب", screen: "findIt",
      params: { datasetKey: "shapes", title: "🔎 جِد الشكل", verb: "اضغط على", bg: "linear-gradient(180deg,#7ff0e6,#14b8a8)" } },
  ],
};
