/* ================= تبدیل تاریخ‌ها ================= */
function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { jy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let jm, jd;
  if (days < 186) { jm = 1 + Math.floor(days / 31); jd = 1 + (days % 31); }
  else { jm = 7 + Math.floor((days - 186) / 30); jd = 1 + ((days - 186) % 30); }
  return { jy, jm, jd };
}
const jalaliMonths = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const gregorianMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const hijriMonths = ['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذی‌القعده','ذی‌الحجه'];

function gregorianToHijri(gy, gm, gd) {
  const jd = Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
    Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) + gd - 32075;
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hm = Math.floor((24 * l3) / 709);
  const hd = l3 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return { hy, hm, hd };
}

function getIranNow() {
  const iranString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' });
  return new Date(iranString);
}
function todayKeyIran() {
  const n = getIranNow();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

function updateDateWidgets() {
  const now = getIranNow();
  const { jy, jm, jd } = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  document.getElementById('shamsiDate').textContent = `${jd} ${jalaliMonths[jm - 1]} ${jy}`;
  document.getElementById('gregorianDate').textContent = `${now.getDate()} ${gregorianMonths[now.getMonth()]} ${now.getFullYear()}`;
  const { hy, hm, hd } = gregorianToHijri(now.getFullYear(), now.getMonth() + 1, now.getDate());
  document.getElementById('hijriDate').textContent = `${hd} ${hijriMonths[hm - 1]} ${hy}`;
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('liveClock').textContent = `${h}:${m}:${s}`;
}
updateDateWidgets();
setInterval(updateDateWidgets, 1000);

const dueDateInput = document.getElementById('dueDateInput');
const dueDateConverted = document.getElementById('dueDateConverted');
dueDateInput.addEventListener('change', () => {
  if (!dueDateInput.value) { dueDateConverted.textContent = ''; return; }
  const [y, m, d] = dueDateInput.value.split('-').map(Number);
  const { jy, jm, jd } = gregorianToJalali(y, m, d);
  const { hy, hm, hd } = gregorianToHijri(y, m, d);
  dueDateConverted.textContent = `معادل: ${jd} ${jalaliMonths[jm - 1]} ${jy} (شمسی) | ${hd} ${hijriMonths[hm - 1]} ${hy} (قمری)`;
});

/* ================= جمله انگیزشی روزانه ================= */
const quotes = [
  'کارهای بزرگ از قدم‌های کوچیک شروع می‌شن، همین امروز رو شروع کن.',
  'پیشرفت همیشه خطی نیست، مهم اینه که ادامه بدی.',
  'هر کاری که امروز تموم می‌کنی، یه قدم به هدفت نزدیک‌تری.',
  'نظم کوچیک امروز، نتیجه‌ی بزرگ فرداست.',
  'به‌جای کامل بودن، به تداوم داشتن فکر کن.',
  'یه روز سخت، دلیل نمی‌شه مسیر رو رها کنی.',
  'هر کار تموم‌شده، یه دلیل برای افتخار به خودته.'
];
(function showDailyQuote() {
  const dayIndex = new Date(todayKeyIran()).getDate() % quotes.length;
  document.getElementById('quoteBanner').textContent = '💬 ' + quotes[dayIndex];
})();

/* ================= تب‌بندی ================= */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'goalTab') renderGoalPanel();
    if (btn.dataset.tab === 'profileTab') renderProfile();
  });
});

/* ================= حالت تاریک ================= */
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-mode'); themeToggle.textContent = '☀️'; }
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ================= Toast ================= */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ================= منطق کارها ================= */
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentFilter = 'all';
let searchTerm = '';
let sortMode = 'newest';

const taskInput = document.getElementById('taskInput');
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('.filter-btn');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

const categoryLabels = { general:'عمومی', work:'کاری', study:'درسی', personal:'شخصی' };
const priorityLabels = { low:'کم', medium:'متوسط', high:'زیاد' };
const priorityRank = { high:0, medium:1, low:2 };

function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({
    id: Date.now(), text, note: noteInput.value.trim(), completed: false, completedAt: null,
    priority: prioritySelect.value, category: categorySelect.value,
    dueDate: dueDateInput.value || null, createdAt: todayKeyIran()
  });
  taskInput.value = ''; noteInput.value = ''; dueDateInput.value = ''; dueDateConverted.textContent = '';
  saveTasks(); render();
}

function toggleTask(id) {
  let justCompleted = false;
  tasks = tasks.map(t => {
    if (t.id !== id) return t;
    const nowCompleted = !t.completed;
    if (nowCompleted) justCompleted = true;
    return { ...t, completed: nowCompleted, completedAt: nowCompleted ? todayKeyIran() : null };
  });
  saveTasks(); render();

  if (justCompleted && goal) {
    const doneToday = completedCountOnDay(todayKeyIran());
    if (doneToday === goal.dailyTarget) showToast('🎉 آفرین! هدف روزانه‌ت رو تکمیل کردی!');
    else if (doneToday < goal.dailyTarget) showToast(`✅ عالی بود! ${goal.dailyTarget - doneToday} کار دیگه تا هدف امروز مونده`);
  }
  if (document.getElementById('goalTab').classList.contains('active')) renderGoalPanel();
}

function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); saveTasks(); render(); }

function editTaskText(id, newText) {
  const trimmed = newText.trim();
  if (trimmed === '') return;
  tasks = tasks.map(t => t.id === id ? { ...t, text: trimmed } : t);
  saveTasks(); render();
}

function clearCompleted() { tasks = tasks.filter(t => !t.completed); saveTasks(); render(); }

function getFilteredTasks() {
  let list = tasks;
  if (currentFilter === 'active') list = list.filter(t => !t.completed);
  else if (currentFilter === 'completed') list = list.filter(t => t.completed);
  else if (currentFilter === 'high') list = list.filter(t => t.priority === 'high');
  if (searchTerm) list = list.filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()));
  list = [...list];
  if (sortMode === 'priority') list.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  else if (sortMode === 'due') list.sort((a, b) => (a.dueDate || '9999') > (b.dueDate || '9999') ? 1 : -1);
  else list.sort((a, b) => b.id - a.id);
  return list;
}

function isOverdue(dueDate) { if (!dueDate) return false; return dueDate < todayKeyIran(); }
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

function render() {
  const filtered = getFilteredTasks();
  taskList.innerHTML = '';
  if (filtered.length === 0) {
    taskList.innerHTML = '<li class="empty-message">کاری برای نمایش نیست</li>';
  } else {
    filtered.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item priority-${task.priority}` + (task.completed ? ' completed' : '');
      const overdue = !task.completed && isOverdue(task.dueDate);
      const dueTagHtml = task.dueDate ? `<span class="task-tag ${overdue ? 'due-overdue' : ''}">📅 ${task.dueDate}${overdue ? ' (گذشته)' : ''}</span>` : '';
      const noteHtml = task.note ? `<div class="task-note">📝 ${escapeHtml(task.note)}</div>` : '';
      li.innerHTML = `
        <div class="task-number">${index + 1}</div>
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <div class="task-main">
          <div class="task-text" title="برای ویرایش دابل‌کلیک کن">${escapeHtml(task.text)}</div>
          ${noteHtml}
          <div class="task-meta">
            <span class="task-tag">🏷 ${categoryLabels[task.category] || task.category}</span>
            <span class="task-tag">⭐ ${priorityLabels[task.priority] || task.priority}</span>
            ${dueTagHtml}
          </div>
        </div>
        <button class="delete-btn">✕</button>
      `;
      li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTask(task.id));
      li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
      const textEl = li.querySelector('.task-text');
      textEl.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text'; input.value = task.text;
        input.style.width = '100%'; input.style.padding = '4px'; input.style.fontSize = '14px';
        textEl.replaceWith(input); input.focus();
        const finishEdit = () => editTaskText(task.id, input.value);
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', e => { if (e.key === 'Enter') finishEdit(); });
      });
      taskList.appendChild(li);
    });
  }
  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} کار باقی مونده`;
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = percent + '%';
  progressText.textContent = `${percent}٪ تکمیل شده (${done} از ${total})`;
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => { if (e.key === 'Enter') addTask(); });
clearCompletedBtn.addEventListener('click', clearCompleted);
searchInput.addEventListener('input', () => { searchTerm = searchInput.value; render(); });
sortSelect.addEventListener('change', () => { sortMode = sortSelect.value; render(); });
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

/* ================= پشتیبان‌گیری ================= */
document.getElementById('exportBtn').addEventListener('click', () => {
  const backup = { tasks, goal: JSON.parse(localStorage.getItem('goal') || 'null'), exportedAt: todayKeyIran() };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `todo-backup-${todayKeyIran()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('⬇️ فایل پشتیبان دانلود شد');
});

document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      if (data.tasks) { tasks = data.tasks; saveTasks(); render(); }
      if (data.goal) { goal = data.goal; localStorage.setItem('goal', JSON.stringify(goal)); }
      showToast('⬆️ اطلاعات با موفقیت بازیابی شد');
      renderGoalPanel();
    } catch (err) { alert('فایل پشتیبان معتبر نیست'); }
  };
  reader.readAsText(file);
});

/* ================= ردیاب هدف ================= */
let goal = JSON.parse(localStorage.getItem('goal') || 'null');

const goalNameInput = document.getElementById('goalNameInput');
const goalDailyTarget = document.getElementById('goalDailyTarget');
const goalDeadline = document.getElementById('goalDeadline');
const saveGoalBtn = document.getElementById('saveGoalBtn');
const goalSummary = document.getElementById('goalSummary');
const goalMessage = document.getElementById('goalMessage');
const todayStatusCard = document.getElementById('todayStatusCard');
const streakCard = document.getElementById('streakCard');

(function setupDeadlineLimits() {
  const now = getIranNow();
  const min = new Date(now); min.setDate(min.getDate() + 1);
  const max = new Date(now); max.setFullYear(max.getFullYear() + 3);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  goalDeadline.min = fmt(min);
  goalDeadline.max = fmt(max);
})();

function loadGoalIntoForm() {
  if (!goal) return;
  goalNameInput.value = goal.name;
  goalDailyTarget.value = goal.dailyTarget;
  goalDeadline.value = goal.deadline;
}
loadGoalIntoForm();

saveGoalBtn.addEventListener('click', () => {
  const name = goalNameInput.value.trim();
  const dailyTarget = parseInt(goalDailyTarget.value) || 1;
  const deadline = goalDeadline.value;
  if (!name || !deadline) { alert('لطفاً اسم هدف و ددلاین رو مشخص کن'); return; }
  if (deadline < goalDeadline.min) { alert('ددلاین باید حداقل از فردا باشه'); return; }
  goal = { name, dailyTarget, deadline, startDate: goal ? goal.startDate : todayKeyIran() };
  localStorage.setItem('goal', JSON.stringify(goal));
  showToast('🎯 هدف ذخیره شد!');
  renderGoalPanel();
});

function completedCountOnDay(dayKey) { return tasks.filter(t => t.completed && t.completedAt === dayKey).length; }
function isSuccessDay(dayKey, target) { return completedCountOnDay(dayKey) >= target; }
function shiftDayKey(dayKey, offsetDays) {
  const [y, m, d] = dayKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + offsetDays);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function calcCurrentStreak(target) {
  let streak = 0;
  let day = todayKeyIran();
  if (!isSuccessDay(day, target)) day = shiftDayKey(day, -1);
  while (goal && day >= goal.startDate && isSuccessDay(day, target)) { streak++; day = shiftDayKey(day, -1); }
  return streak;
}

function calcLongestStreak(target) {
  if (!goal) return 0;
  let longest = 0, current = 0, day = goal.startDate, today = todayKeyIran();
  while (day <= today) {
    if (isSuccessDay(day, target)) { current++; longest = Math.max(longest, current); }
    else current = 0;
    day = shiftDayKey(day, 1);
  }
  return longest;
}

function renderBarChart(containerId, data) {
  const el = document.getElementById(containerId);
  el.innerHTML = '';
  data.forEach(item => {
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `<div class="bar-fill" style="height:${Math.max(item.percent, 3)}%; background:${item.color};"></div><div class="bar-col-label">${item.label}</div>`;
    el.appendChild(col);
  });
}

function renderGoalPanel() {
  if (!goal) {
    todayStatusCard.style.display = 'none';
    streakCard.style.display = 'none';
    goalSummary.innerHTML = 'هنوز هدفی ثبت نکردی. یه هدف با ددلاین مشخص بذار تا عملکردت رو دنبال کنیم.';
    document.getElementById('weeklyChart').innerHTML = '';
    document.getElementById('monthlyChart').innerHTML = '';
    document.getElementById('yearlyChart').innerHTML = '';
    goalMessage.textContent = ''; goalMessage.className = 'goal-message';
    return;
  }
  todayStatusCard.style.display = 'block';
  streakCard.style.display = 'block';

  const target = goal.dailyTarget;
  const today = todayKeyIran();
  const doneToday = completedCountOnDay(today);

  if (doneToday >= target) {
    todayStatusCard.className = 'today-status-card done';
    todayStatusCard.innerHTML = `🎉 امروز <b>${doneToday}</b> از <b>${target}</b> کار رو انجام دادی — به هدف امروزت رسیدی!`;
  } else {
    todayStatusCard.className = 'today-status-card pending';
    todayStatusCard.innerHTML = `امروز <b>${doneToday}</b> از <b>${target}</b> کار انجام دادی. ${target - doneToday} کار دیگه مونده — اشکالی نداره اگه نرسیدی، فردا جبران کن.`;
  }

  const streak = calcCurrentStreak(target);
  const longest = calcLongestStreak(target);
  streakCard.innerHTML = `🔥 ${streak} روز متوالی موفق &nbsp;|&nbsp; 🏆 رکورد: ${longest} روز`;

  const weekData = [];
  for (let i = 6; i >= 0; i--) {
    const dayKey = shiftDayKey(today, -i);
    const count = completedCountOnDay(dayKey);
    const success = count >= target;
    const percent = Math.min(100, Math.round((count / target) * 100));
    weekData.push({ label: dayKey.slice(5), percent, color: success ? 'var(--success)' : (count > 0 ? 'var(--warning)' : 'var(--border-color)') });
  }
  renderBarChart('weeklyChart', weekData);

  const monthData = [];
  for (let w = 3; w >= 0; w--) {
    let successDays = 0;
    for (let d = 0; d < 7; d++) if (isSuccessDay(shiftDayKey(today, -(w * 7 + d)), target)) successDays++;
    const percent = Math.round((successDays / 7) * 100);
    monthData.push({ label: `هفته ${4 - w}`, percent, color: percent >= 70 ? 'var(--success)' : (percent >= 40 ? 'var(--warning)' : 'var(--danger)') });
  }
  renderBarChart('monthlyChart', monthData);

  const yearData = [];
  const now = getIranNow();
  for (let mo = 11; mo >= 0; mo--) {
    let successDays = 0, totalDays = 0;
    for (let d = 0; d < 30; d++) {
      const dayKey = shiftDayKey(today, -(mo * 30 + d));
      if (dayKey > today || dayKey < goal.startDate) continue;
      totalDays++;
      if (isSuccessDay(dayKey, target)) successDays++;
    }
    const percent = totalDays === 0 ? 0 : Math.round((successDays / totalDays) * 100);
    const { jm } = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const monthIndex = ((jm - 1 - mo) % 12 + 12) % 12;
    yearData.push({ label: jalaliMonths[monthIndex].slice(0, 3), percent, color: percent >= 70 ? 'var(--success)' : (percent >= 40 ? 'var(--warning)' : 'var(--danger)') });
  }
  renderBarChart('yearlyChart', yearData);

  let totalDaysSinceStart = 0, successDaysSinceStart = 0, cursor = goal.startDate;
  while (cursor <= today) {
    totalDaysSinceStart++;
    if (isSuccessDay(cursor, target)) successDaysSinceStart++;
    cursor = shiftDayKey(cursor, 1);
  }
  const overallRate = totalDaysSinceStart === 0 ? 0 : Math.round((successDaysSinceStart / totalDaysSinceStart) * 100);
  const deadlineDate = new Date(goal.deadline);
  const todayDate = new Date(today);
  const daysLeft = Math.ceil((deadlineDate - todayDate) / (1000 * 60 * 60 * 24));

  goalSummary.innerHTML = `
    هدف روزانه: <b>${target}</b> کار در روز<br>
    نرخ موفقیت کلی: <b>${overallRate}٪</b> (${successDaysSinceStart} از ${totalDaysSinceStart} روز)<br>
    ${daysLeft >= 0 ? `روزهای باقی‌مونده تا ددلاین: <b>${daysLeft}</b> روز` : `ددلاین <b>${Math.abs(daysLeft)}</b> روز پیش گذشته`}
  `;

  let thisWeekSuccess = 0, lastWeekSuccess = 0;
  for (let d = 0; d < 7; d++) if (isSuccessDay(shiftDayKey(today, -d), target)) thisWeekSuccess++;
  for (let d = 7; d < 14; d++) if (isSuccessDay(shiftDayKey(today, -d), target)) lastWeekSuccess++;
  const diff = thisWeekSuccess - lastWeekSuccess;
  const compareText = diff > 0 ? `📈 نسبت به هفته‌ی قبل ${diff} روز موفق‌تر بودی!`
    : diff < 0 ? `📉 نسبت به هفته‌ی قبل ${Math.abs(diff)} روز کمتر موفق بودی.`
    : `➖ عملکردت نسبت به هفته‌ی قبل ثابت مونده.`;
  goalSummary.innerHTML += `<br><br>${compareText}`;

  goalMessage.className = 'goal-message';
  if (daysLeft < 0) {
    if (overallRate >= 60) {
      goalMessage.classList.add('positive');
      goalMessage.innerHTML = `🎉 تبریک! ددلاینت گذشته و با نرخ موفقیت ${overallRate}٪ عملاً به هدفت رسیدی. وقتشه یه هدف جدید تعریف کنی!`;
    } else {
      goalMessage.classList.add('negative');
      goalMessage.innerHTML = `ددلاینت گذشته و نرخ موفقیتت ${overallRate}٪ بوده. این شکست نیست، فقط یعنی باید هدف روزانه رو واقع‌بینانه‌تر کنی.`;
    }
  } else {
    if (overallRate >= 70) {
      goalMessage.classList.add('positive');
      goalMessage.innerHTML = `✅ عالی پیش میری! با نرخ موفقیت ${overallRate}٪ تا ${daysLeft} روز دیگه به‌راحتی به هدفت می‌رسی.`;
    } else if (overallRate >= 40) {
      goalMessage.classList.add('neutral');
      goalMessage.innerHTML = `⚡ در مسیر هستی ولی نرخ موفقیتت (${overallRate}٪) جای بهبود داره. ${daysLeft} روز وقت داری.`;
    } else {
      goalMessage.classList.add('negative');
      goalMessage.innerHTML = `⚠️ نرخ موفقیتت (${overallRate}٪) پایینه و ${daysLeft} روز مونده. الان بهترین زمانه که تمرکز بیشتری بذاری یا هدف روزانه رو واقع‌بینانه‌تر کنی.`;
    }
  }
}

/* ================= پروفایل (محلی) ================= */
let userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
const authSection = document.getElementById('authSection');
const profileSection = document.getElementById('profileSection');
const avatarPicker = document.getElementById('avatarPicker');
let selectedAvatar = '🧑‍💻';

avatarPicker.querySelectorAll('.avatar-option').forEach(opt => {
  opt.addEventListener('click', () => {
    avatarPicker.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    selectedAvatar = opt.dataset.avatar;
  });
});
avatarPicker.querySelector('.avatar-option').classList.add('selected');

document.getElementById('signupBtn').addEventListener('click', () => {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  if (!name) { alert('لطفاً یه نام نمایشی وارد کن'); return; }
  userProfile = { name, email, avatar: selectedAvatar, since: todayKeyIran() };
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
  showToast(`خوش اومدی ${name}!`);
  renderProfile();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  if (!confirm('مطمئنی می‌خوای از پروفایل خارج بشی؟ (اطلاعات کارها پاک نمی‌شه)')) return;
  localStorage.removeItem('userProfile');
  userProfile = null;
  renderProfile();
});

function renderProfile() {
  if (!userProfile) {
    authSection.style.display = 'block';
    profileSection.style.display = 'none';
    return;
  }
  authSection.style.display = 'none';
  profileSection.style.display = 'block';

  document.getElementById('profileAvatar').textContent = userProfile.avatar;
  document.getElementById('profileName').textContent = userProfile.name;
  document.getElementById('profileEmail').textContent = userProfile.email || '—';
  const { jy, jm, jd } = (() => {
    const [y, m, d] = userProfile.since.split('-').map(Number);
    return gregorianToJalali(y, m, d);
  })();
  document.getElementById('profileSince').textContent = `عضو از ${jd} ${jalaliMonths[jm - 1]} ${jy}`;

  document.getElementById('statTotalTasks').textContent = tasks.filter(t => t.completed).length;
  const target = goal ? goal.dailyTarget : 1;
  document.getElementById('statStreak').textContent = goal ? calcCurrentStreak(target) : 0;
  document.getElementById('statLongest').textContent = goal ? calcLongestStreak(target) : 0;
}

renderGoalPanel();
renderProfile();
render();