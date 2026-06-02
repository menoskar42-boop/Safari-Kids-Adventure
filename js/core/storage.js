// ===== إدارة الحفظ (التقدّم والمكافآت) =====
const KEY = "safari-kids-save-v1";

const DEFAULT_STATE = {
  stars: 0,
  childName: "",
  childGender: "", // "boy" | "girl" | "" (الافتراضي ولد)
  // تقدّم كل منطقة: regionId -> { stars, completed:boolean }
  regions: {},
  // المكافآت المجمّعة: مصفوفة معرّفات
  collection: [],
  // أعلى منطقة مفتوحة (الفهرس) — تُفتح المناطق تدريجياً
  unlockedIndex: 0,
  // العناصر التي رآها الطفل (للمراجعة المتباعدة): "datasetKey:itemKey"
  seen: [],
  // السلسلة اليومية والهدف
  streak: 0,
  lastActiveDate: "", // "YYYY-MM-DD"
  dailyStars: 0,
  dailyDate: "",
  dailyGoal: 5,
  // تذكير وقت الشاشة بالدقائق (0 = مُعطّل)
  screenTimeMin: 0,
  // أفاتار الطفل (معرّف من الكنوز المجموعة) — افتراضي المرشد
  avatarId: "",
};

// تاريخ اليوم محلياً بصيغة YYYY-MM-DD
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function yesterdayOf(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) };
  } catch (e) {
    return structuredClone(DEFAULT_STATE);
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* قد يكون التخزين ممتلئاً أو محظوراً — نتجاهل بهدوء */
  }
}

export const Store = {
  get state() {
    return state;
  },

  addStars(n) {
    state.stars += n;
    persist();
    return state.stars;
  },

  get stars() {
    return state.stars;
  },

  regionProgress(id) {
    return state.regions[id] || { stars: 0, completed: false };
  },

  setRegionStars(id, stars) {
    const cur = this.regionProgress(id);
    state.regions[id] = { ...cur, stars: Math.max(cur.stars, stars) };
    persist();
  },

  markRegionDone(id) {
    const cur = this.regionProgress(id);
    state.regions[id] = { ...cur, completed: true };
    persist();
  },

  isUnlocked(index) {
    return index <= state.unlockedIndex;
  },

  // عدد المناطق المكتملة (لفتح المناطق المتقدّمة تدريجياً)
  completedCount() {
    return Object.values(state.regions).filter((r) => r && r.completed).length;
  },

  // تسجيل أن الطفل رأى عنصراً (حرف/رقم) — للمراجعة المتباعدة
  markSeen(datasetKey, itemKey) {
    const id = `${datasetKey}:${itemKey}`;
    if (!state.seen.includes(id)) {
      state.seen.push(id);
      if (state.seen.length > 400) state.seen.shift();
      persist();
    }
  },
  // العناصر المرئية من مجموعة معيّنة (مصفوفة مفاتيح العناصر)
  seenKeys(datasetKey) {
    const p = datasetKey + ":";
    return state.seen.filter((s) => s.startsWith(p)).map((s) => s.slice(p.length));
  },

  // ===== نموذج الإتقان (تكرار متباعد حقيقي) =====
  // مستوى ٠–٥ لكل عنصر: يرتفع عند الإجابة الصحيحة وينخفض عند الخطأ
  get mastery() {
    return state.mastery || (state.mastery = {});
  },
  getMastery(datasetKey, itemKey) {
    return this.mastery[`${datasetKey}:${itemKey}`] || 0;
  },
  recordReview(datasetKey, itemKey, correct) {
    const m = this.mastery;
    const id = `${datasetKey}:${itemKey}`;
    m[id] = Math.max(0, Math.min(5, (m[id] || 0) + (correct ? 1 : -1)));
    persist();
  },

  // ===== السلسلة اليومية =====
  // تُستدعى عند فتح التطبيق: تُحدّث السلسلة وتعيد ضبط تقدّم اليوم
  touchDaily() {
    const t = today();
    if (state.lastActiveDate === t) {
      // نفس اليوم — لا تغيير
    } else if (state.lastActiveDate === yesterdayOf(t)) {
      state.streak = (state.streak || 0) + 1; // يوم متتالٍ
    } else {
      state.streak = 1; // انقطعت السلسلة أو أول مرة
    }
    state.lastActiveDate = t;
    if (state.dailyDate !== t) {
      state.dailyDate = t;
      state.dailyStars = 0;
    }
    persist();
  },
  get streak() {
    return state.streak || 0;
  },
  get dailyStars() {
    return state.dailyStars || 0;
  },
  get dailyGoal() {
    return state.dailyGoal || 5;
  },
  // تذكير وقت الشاشة (بالدقائق)
  get screenTimeMin() {
    return state.screenTimeMin || 0;
  },
  setScreenTime(min) {
    state.screenTimeMin = Math.max(0, min | 0);
    persist();
  },

  // أفاتار الطفل
  get avatarId() {
    return state.avatarId || "";
  },
  setAvatar(id) {
    state.avatarId = id;
    persist();
  },
  // اسم الطفل
  get childName() {
    return state.childName || "";
  },
  setChildName(name) {
    // نزيل < > لمنع أي حقن HTML عند إدراج الاسم في innerHTML
    state.childName = String(name || "").replace(/[<>]/g, "").slice(0, 20);
    persist();
  },

  // جنس الطفل لمخاطبة ميزو بالصيغة الصحيحة (افتراضي ولد)
  get childGender() {
    return state.childGender === "girl" ? "girl" : "boy";
  },
  setChildGender(g) {
    state.childGender = g === "girl" ? "girl" : "boy";
    persist();
  },

  // إكسسوار ميزو الذي اختاره الطفل (إيموجي على رأسه) — "" = بلا
  get mizoAccessory() {
    return state.mizoAccessory || "";
  },
  setMizoAccessory(acc) {
    state.mizoAccessory = String(acc || "").slice(0, 4);
    persist();
  },

  // الرقم السري لبوّابة ولي الأمر (٤ أرقام). فارغ = لم يُضبط بعد
  get parentPin() {
    return state.parentPin || "";
  },
  setParentPin(pin) {
    state.parentPin = String(pin || "").replace(/\D/g, "").slice(0, 4);
    persist();
  },

  // ===== ذاكرة صداقة ميزو (يتذكّر الطفل) =====
  // آخر منطقة زارها، آخر إنجاز، آخر تاريخ نشاط، وعدد الجلسات
  get friendship() {
    return state.friendship || (state.friendship = { lastRegion: "", lastReward: "", lastDate: "", visits: 0, xp: 0, level: 1 });
  },
  // مستوى الصداقة يكبر كلّما تعلّم الطفل (كل ١٢ نقطة = مستوى)
  get friendLevel() {
    return this.friendship.level || 1;
  },
  addFriendship(n = 1) {
    const f = this.friendship;
    const before = f.level || 1;
    f.xp = (f.xp || 0) + n;
    f.level = Math.floor(f.xp / 12) + 1;
    persist();
    return f.level > before ? f.level : 0; // يعيد المستوى الجديد عند الترقية، وإلا 0
  },
  rememberRegion(name) {
    const f = this.friendship;
    f.lastRegion = String(name || "").slice(0, 40);
    persist();
  },
  rememberReward(name) {
    const f = this.friendship;
    f.lastReward = String(name || "").slice(0, 40);
    persist();
  },
  // تُستدعى عند بدء التطبيق: تزيد عدّاد الجلسات وتعيد true إن كان يوماً جديداً
  touchFriendship() {
    const f = this.friendship;
    const t = today();
    const newDay = f.lastDate !== t;
    if (newDay) { f.visits = (f.visits || 0) + 1; f.lastDate = t; persist(); }
    return newDay;
  },

  // ===== عجلة الحظ اليومية =====
  get lastSpinDate() {
    return state.lastSpinDate || "";
  },
  canSpinToday() {
    return this.lastSpinDate !== today();
  },
  markSpun() {
    state.lastSpinDate = today();
    persist();
  },

  // تشغيل/تعطيل الذكاء الاصطناعي والميكروفون (افتراضياً مُفعّل)
  get aiEnabled() {
    return state.aiEnabled !== false;
  },
  setAiEnabled(on) {
    state.aiEnabled = !!on;
    persist();
  },

  // الفئة العمرية لتدرّج الصعوبة: "" غير محدّد، "small" ٣–٤، "big" ٥–٦
  get ageBand() {
    return state.ageBand || "";
  },
  setAgeBand(band) {
    state.ageBand = band === "small" || band === "big" ? band : "";
    persist();
  },

  // تقدّم اليوم؛ تعيد true عند بلوغ الهدف لأول مرة اليوم
  addDailyProgress(n = 1) {
    const t = today();
    if (state.dailyDate !== t) {
      state.dailyDate = t;
      state.dailyStars = 0;
    }
    const before = state.dailyStars;
    state.dailyStars += n;
    persist();
    return before < state.dailyGoal && state.dailyStars >= state.dailyGoal;
  },

  // ===== رحلة اليوم (خطة تعلّم يومية) =====
  // تتبّع الخطوات المكتملة اليوم؛ تُصفَّر تلقائياً مع كل يوم جديد
  get dailyPlan() {
    const t = today();
    if (!state.dailyPlan || state.dailyPlan.date !== t) {
      state.dailyPlan = { date: t, done: [] };
      persist();
    }
    return state.dailyPlan;
  },
  markDailyStep(i) {
    const p = this.dailyPlan;
    if (!p.done.includes(i)) { p.done.push(i); persist(); }
  },
  // يمنح مكافأة إكمال الرحلة مرّة واحدة؛ يعيد true إن لم تُمنح بعد
  markDailyBonus() {
    const p = this.dailyPlan;
    if (!p.bonus) { p.bonus = true; persist(); return true; }
    return false;
  },
  // الخطوة الجارية حالياً (تُضبط عند إطلاقها من الرحلة لتُعلَّم عند إتمامها)
  get activeStep() {
    return state.activeStep == null ? null : state.activeStep;
  },
  set activeStep(i) {
    state.activeStep = i;
    persist();
  },

  unlockNext(index) {
    if (index + 1 > state.unlockedIndex) {
      state.unlockedIndex = index + 1;
      persist();
    }
  },

  addToCollection(itemId) {
    if (!state.collection.includes(itemId)) {
      state.collection.push(itemId);
      persist();
      return true; // جديد
    }
    return false;
  },

  hasCollected(itemId) {
    return state.collection.includes(itemId);
  },

  reset() {
    state = structuredClone(DEFAULT_STATE);
    persist();
  },
};
