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
};
