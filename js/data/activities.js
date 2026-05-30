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
  // english: [...]   ← المرحلة الثالثة
  // numbers: [...]   ← المرحلة الرابعة
  // animals: [...]   ← المرحلة الخامسة
};
