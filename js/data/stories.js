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
      { emoji: "🦁", mood: "calm", text: "في غابةٍ خضراء كبيرة، كان يعيش أسدٌ قويٌّ طيّبُ القلب." },
      { emoji: "🐭", mood: "scared", text: "وفجأةً... سمع صوتاً صغيراً يرتجف! فأرٌ خائفٌ مختبئٌ تحت الشجرة." },
      { emoji: "🤝", mood: "happy", text: "ابتسم الأسد وقال بحنان: لا تخفْ يا صغيري، أنا صديقُك." },
      { emoji: "🧀", mood: "happy", text: "فرح الفأر وأحضر له أطيبَ قطعةِ جبن، وقال: شكراً يا صديقي!" },
      { emoji: "❤️", mood: "wonder", text: "ومن ذلك اليوم، صارا أعزَّ صديقَين في الغابة كلِّها." },
    ],
  },
  {
    id: "apple-tree",
    title: "شجرة التفاح الكريمة",
    emoji: "🍎",
    region: "fruits",
    scenes: [
      { emoji: "🌳", mood: "calm", text: "في المزرعة، وقفت شجرةُ تفّاحٍ كبيرةٌ كريمةُ القلب." },
      { emoji: "🍎", mood: "happy", text: "كانت تُعطي تفّاحةً حمراء لكلِّ طفلٍ جائع." },
      { emoji: "👧", mood: "happy", text: "أكلت سارة تفّاحةً، فصارت قويّةً وسعيدة." },
      { emoji: "🌱", mood: "calm", text: "وردّاً للجميل، زرعت سارة البذور لتكبر أشجارٌ جديدة." },
      { emoji: "🍏", mood: "wonder", text: "وبعد أيّام... نبتت شجرةٌ صغيرةٌ خضراء! يا للروعة." },
    ],
  },
  {
    id: "count-stars",
    title: "النجوم الخمس",
    emoji: "⭐",
    region: "numbers",
    scenes: [
      { emoji: "🌙", mood: "calm", text: "في الليل الهادئ، نظر القمر إلى السماء الواسعة." },
      { emoji: "⭐", mood: "wonder", text: "وفجأةً... ظهرت نجمةٌ واحدةٌ تلمع بنورٍ جميل." },
      { emoji: "✨", mood: "excited", text: "ثم ظهرت نجمتان، فثلاثٌ، فأربع... عُدّوا معي!" },
      { emoji: "🌟", mood: "wonder", text: "وأخيراً صارت خمسَ نجماتٍ تتلألأ في السماء." },
      { emoji: "😴", mood: "calm", text: "ونام الأطفال بسلامٍ وهم يعدّون النجوم الخمس." },
    ],
  },
  {
    id: "brave-fish",
    title: "السمكة الشجاعة",
    emoji: "🐠",
    region: "fish",
    scenes: [
      { emoji: "🐠", mood: "calm", text: "في البحر الأزرق العميق، كانت تعيش سمكةٌ صغيرةٌ ملوّنة." },
      { emoji: "🌊", mood: "excited", text: "قرّرت بشجاعة أن تكتشف البحر الكبير وحدها... يا للمغامرة!" },
      { emoji: "🐙", mood: "happy", text: "في الطريق قابلت أخطبوطاً لطيفاً مدَّ لها يداً ليساعدها." },
      { emoji: "🐢", mood: "calm", text: "وسبحت بهدوءٍ مع سلحفاةٍ حكيمةٍ بطيئةٍ تحبّ التأمّل." },
      { emoji: "🏡", mood: "wonder", text: "ثم عادت إلى بيتها فخورةً سعيدةً بمغامرتها الجميلة." },
    ],
  },
  // ===== قصص القيم والسلوكيات =====
  {
    id: "cleanliness",
    title: "النظافة سرّ الصحّة",
    emoji: "🧼",
    region: "values",
    scenes: [
      { emoji: "🙋", mood: "happy", text: "لعب سامي في الحديقة طوال النهار، وفرِح كثيراً!" },
      { emoji: "🖐️", mood: "calm", text: "لكن... انظروا! اتّسخت يداه بالتراب من كثرة اللعب." },
      { emoji: "🚰", mood: "happy", text: "فذهب سامي بسرعة وغسل يديه بالماء والصابون." },
      { emoji: "✨", mood: "wonder", text: "فصارت يداه نظيفتين ولامعتين كالمرآة!" },
      { emoji: "😄", mood: "happy", text: "تذكّروا: النظافة تجعلنا أصحّاء وسعداء دائماً." },
    ],
  },
  {
    id: "cooperation",
    title: "التعاون قوّة",
    emoji: "🤝",
    region: "values",
    scenes: [
      { emoji: "🧸", mood: "calm", text: "بعد اللعب، تبعثرت ألعاب الأصدقاء في كلّ مكانٍ بالغرفة." },
      { emoji: "😟", mood: "sad", text: "تنهّد أحدهم وقال: الترتيب وحدي صعبٌ جداً..." },
      { emoji: "🤝", mood: "excited", text: "فجاءت الفكرة! تعاون الأصدقاء كلُّهم معاً في الترتيب." },
      { emoji: "⏱️", mood: "wonder", text: "وفي دقائقَ قليلة... صارت الغرفة مرتّبةً ولامعة!" },
      { emoji: "🎉", mood: "happy", text: "بالتعاون نُنجز كلَّ شيءٍ بسرعةٍ وفرح." },
    ],
  },
  {
    id: "help-mom",
    title: "مساعدة أمّي",
    emoji: "👩",
    region: "values",
    scenes: [
      { emoji: "👩", mood: "sad", text: "كانت أمُّ ليلى متعبةً وهي تُعِدّ الطعام." },
      { emoji: "🤔", mood: "calm", text: "فوقفت ليلى تفكّر: كيف أساعد أمّي الحبيبة؟" },
      { emoji: "🍽️", mood: "happy", text: "وبكلّ حبّ، رتّبت الصحون على المائدة بنفسها." },
      { emoji: "🥰", mood: "happy", text: "فابتسمت الأمُّ ابتسامةً كبيرة وعانقت ليلى." },
      { emoji: "❤️", mood: "wonder", text: "فمساعدةُ الأهل تملأ البيت حبّاً ودِفئاً." },
    ],
  },
  {
    id: "honesty",
    title: "الصدق أمانة",
    emoji: "🌟",
    region: "values",
    scenes: [
      { emoji: "🍪", mood: "happy", text: "رأى عمر قطعةَ الحلوى الشهيّة... فأكلها بسرعةٍ دون إذن." },
      { emoji: "😳", mood: "scared", text: "ثم جاءت أمُّه وسألت: مَن أكل الحلوى يا تُرى؟" },
      { emoji: "🗣️", mood: "calm", text: "ابتلع عمر ريقه، وقال بصدقٍ وشجاعة: أنا أكلتُها... أنا آسف." },
      { emoji: "🤗", mood: "happy", text: "ففرحت الأمُّ بصدقه أكثرَ من الحلوى، وعانقته بحبّ." },
      { emoji: "🌟", mood: "wonder", text: "تذكّرْ دائماً: الصادقُ محبوبٌ عند الجميع." },
    ],
  },
  {
    id: "sharing",
    title: "المشاركة جميلة",
    emoji: "🎁",
    region: "values",
    scenes: [
      { emoji: "🍎", mood: "happy", text: "كان مع نور تفّاحتان حمراوان لذيذتان." },
      { emoji: "👦", mood: "sad", text: "لكنها رأت صديقها جالساً جائعاً بلا طعام..." },
      { emoji: "🤲", mood: "happy", text: "ففكّرت نور قليلاً... ثم أعطته تفّاحةً وقاسمته." },
      { emoji: "😊", mood: "happy", text: "فأكلا معاً وضحكا بسعادةٍ كبيرة." },
      { emoji: "💛", mood: "wonder", text: "وهكذا... المشاركةُ تصنع أجملَ الصداقات." },
    ],
  },
  {
    id: "little-bird",
    title: "العصفور الذي تعلّم الطيران",
    emoji: "🐦",
    region: "birds",
    scenes: [
      { emoji: "🪹", mood: "sad", text: "في عشٍّ صغيرٍ عالٍ، عاش عصفورٌ صغيرٌ خائفٌ من الطيران." },
      { emoji: "🐦", mood: "calm", text: "ربتت على كتفه أمُّه وقالت: حرّكْ جناحيك بهدوءٍ يا صغيري." },
      { emoji: "🌬️", mood: "excited", text: "رفرف العصفور... قليلاً قليلاً... ثم أقوى وأقوى!" },
      { emoji: "🕊️", mood: "wonder", text: "وفجأةً ارتفع عالياً فوق الأشجار! إنه يطير حقّاً!" },
      { emoji: "🌈", mood: "happy", text: "وصار أسعدَ عصفورٍ يلعب ويطير في السماء الواسعة." },
    ],
  },
  {
    id: "rainbow-colors",
    title: "قوس قزح الجميل",
    emoji: "🌈",
    region: "colors",
    scenes: [
      { emoji: "🌧️", mood: "calm", text: "بعد المطر، أطلّت الشمسُ من خلف الغيوم تبتسم." },
      { emoji: "🔴", mood: "wonder", text: "وفي السماء... ظهر الأحمرُ، ثم البرتقاليُّ والأصفر!" },
      { emoji: "🟢", mood: "excited", text: "وجاء الأخضرُ والأزرقُ يلوّنان السماء بفرح." },
      { emoji: "🟣", mood: "wonder", text: "وأكمل البنفسجيُّ قوسَ قزحٍ في غاية الجمال." },
      { emoji: "😍", mood: "happy", text: "ففرح الأطفال بكلِّ هذه الألوان الرائعة." },
    ],
  },
  {
    id: "family-love",
    title: "عائلتي الحبيبة",
    emoji: "👨‍👩‍👧‍👦",
    region: "family",
    scenes: [
      { emoji: "🏡", mood: "calm", text: "في بيتٍ دافئٍ صغير، تعيش عائلةٌ سعيدةٌ متحابّة." },
      { emoji: "👨", mood: "happy", text: "بابا يذهب إلى عمله، ويعود مساءً بابتسامةٍ كبيرة." },
      { emoji: "👩", mood: "happy", text: "وماما تطبخ الطعام اللذيذ وتقرأ لنا أجملَ القصص." },
      { emoji: "🧒", mood: "happy", text: "والأطفال يلعبون معاً ويساعدون بفرحٍ ونشاط." },
      { emoji: "❤️", mood: "wonder", text: "فالعائلةُ كنزٌ ثمينٌ نحبّه ونحافظ عليه." },
    ],
  },
  {
    id: "kind-doctor",
    title: "الطبيب الطيّب",
    emoji: "👩‍⚕️",
    region: "jobs",
    scenes: [
      { emoji: "🤒", mood: "sad", text: "أصاب الأرنبَ الصغير زكامٌ ورشح... فصار حزيناً." },
      { emoji: "👩‍⚕️", mood: "calm", text: "فذهب إلى الطبيبة الطيّبة في عيادتها النظيفة." },
      { emoji: "🩺", mood: "calm", text: "فحصته بلطفٍ وحنان، وأعطته دواءً حلوَ المذاق." },
      { emoji: "🥕", mood: "happy", text: "وقالت بابتسامة: كُلْ جيّداً ونَمْ مبكراً يا صغيري." },
      { emoji: "😄", mood: "happy", text: "وبعد يومين... شُفي الأرنب تماماً وعاد يقفز ويلعب!" },
    ],
  },
  {
    id: "little-car",
    title: "السيّارة الصغيرة المجتهدة",
    emoji: "🚗",
    region: "transport",
    scenes: [
      { emoji: "🚗", mood: "happy", text: "كانت هناك سيّارةٌ حمراءُ صغيرةٌ مليئةٌ بالنشاط." },
      { emoji: "⛰️", mood: "calm", text: "وأمامها تلٌّ عالٍ جداً... تُرى هل تستطيع الصعود؟" },
      { emoji: "💨", mood: "excited", text: "حاولت... ودفعت نفسها بكلّ قوّتها... هيا! هيا!" },
      { emoji: "🎉", mood: "wonder", text: "وأخيراً... وصلت إلى القمّة بنجاح! يا للفرحة!" },
      { emoji: "🌟", mood: "happy", text: "وتعلّمنا منها: مَن جدَّ وجَد، ولا نستسلمُ أبداً." },
    ],
  },
  {
    id: "sun-and-rain",
    title: "الشمس والمطر",
    emoji: "🌦️",
    region: "weather",
    scenes: [
      { emoji: "☀️", mood: "happy", text: "في الصباح، أشرقت الشمسُ الدافئة تُحيّي العالم." },
      { emoji: "☁️", mood: "calm", text: "ثم جاءت غيمةٌ بيضاء صغيرة تتمشّى في السماء." },
      { emoji: "🌧️", mood: "excited", text: "وفجأةً... نزل المطرُ يرقص، فسقى الأزهارَ والأشجار!" },
      { emoji: "🌈", mood: "wonder", text: "وبعد المطر، أطلّ قوسُ قزحٍ في غاية الجمال." },
      { emoji: "🌻", mood: "happy", text: "ففرحت الأرضُ بالشمس والمطر معاً." },
    ],
  },
];

export function getStory(id) {
  return STORIES.find((s) => s.id === id);
}
export function storiesForRegion(region) {
  return STORIES.filter((s) => s.region === region);
}
