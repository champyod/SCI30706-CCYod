'use strict';

/* =====================================================
   FinGoal — Financial Helper App (Local Storage)
   ===================================================== */

// ---------- CONSTANTS ----------
const STORAGE_TX   = 'fingoal_transactions';
const STORAGE_GOAL = 'fingoal_goals';
const STORAGE_MODE = 'fingoal_mode';
const STORAGE_SAVINGS = 'fingoal_savings_balance';
const STORAGE_DEDUCTED = 'fingoal_total_deducted';
const INTEREST_RATE = 0.015;
const DAILY_RATE = INTEREST_RATE / 365;

const QUOTES = [
  'เงินออมเล็ก ๆ วันนี้ คือก้อนใหญ่ในวันหน้า',
  'คนรวยไม่ใช่คนที่หารายได้มากที่สุด แต่คือคนที่เก็บได้มากที่สุด',
  'ออมก่อนใช้ แล้วชีวิตจะสบาย',
  'ทุกบาทที่เก็บวันนี้ คืออิสรภาพในวันหน้า',
  'เป้าหมายใหญ่ เริ่มจากการออมเล็ก ๆ',
  'อย่ารอให้มีเงินเหลือค่อยออม ใหออมก่อนแล้วค่อยใช้',
  'เงินออมคือเพื่อนซี้ที่ไม่เคยหักหลัง',
  'ยิ่งออมไว ยิ่งถึงฝันเร็ว',
  'การออมไม่ใช่การอด แต่คือการเลือก',
  'ใช้เท่าที่จำเปน เก็บเท่าที่ควร',
  'รวยช้า ไม่เป็นไร ขอแคไมจนตลอดชีวิต',
  'ทุกวันคือโอกาสที่ดีในการเริ่มออม',
  'อนาคตที่ดี เริ่มจากวินัยทางการเงินวันนี้',
  'เงินออมคือเกราะปองกันวันที่ไม่คาดคิด',
  'มีเงินเก็บ = มีทางเลือกในชีวิต',
  'ไมสำคัญว่าคุณจะเริ่มด้วยจำนวนเท่าไหร สำคัญที่คุณเริ่ม',
  'ดอกเบี้ยทบต้นคือสิ่งมหัศจรรย์อันดับ 8 ของโลก',
  'ก่อนซื้อของ ถามตัวเองวา "จำเป็น" หรือ "อยากได้"',
  'มีเงินเก็บ = นอนหลับสบาย',
  'จัดสรรก่อนใช้ ชีวิตมีสมดุล',
];

const CATEGORIES_INCOME = ['เงินเดือน', 'รายรับพิเศษ', 'โบนัส', 'ขายของ', 'ลงทุน', 'อื่น ๆ'];
const CATEGORIES_EXPENSE = ['อาหาร', 'ค่าเดินทาง', 'ค่าที่พัก', 'ค่าใช้จ่ายส่วนตัว', 'ช้อปปิ้ง', 'สันทนาการ', 'การศึกษา', 'สุขภาพ', 'อื่น ๆ'];

const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// ---------- STATE ----------
let currentMode = 'deduct';

// ---------- DOM REFS ----------
const $ = id => document.getElementById(id);

const dom = {};

function cacheDom() {
  dom.totalSavings  = $('totalSavings');
  dom.monthIncome   = $('monthIncome');
  dom.monthExpense  = $('monthExpense');
  dom.totalInterest = $('totalInterest');
  dom.gpTitle       = $('gpTitle');
  dom.gpPercent     = $('gpPercent');
  dom.gpBarFill     = $('gpBarFill');
  dom.gpCurrent     = $('gpCurrent');
  dom.gpTarget      = $('gpTarget');
  dom.quoteText     = $('quoteText');
  dom.chartBar      = $('chartBar');
  dom.chartLine     = $('chartLine');
  dom.chartPie      = $('chartPie');

  dom.modeDeduct = $('modeDeduct');
  dom.modeRemain = $('modeRemain');
  dom.modeDesc   = $('modeDesc');

  dom.txType     = $('txType');
  dom.txCategory = $('txCategory');
  dom.txAmount   = $('txAmount');
  dom.txNote     = $('txNote');
  dom.txDate     = $('txDate');
  dom.txSaveBtn  = $('txSaveBtn');
  dom.txTable    = $('txTable');
  dom.txFilter   = $('txFilter');
  dom.txClearBtn = $('txClearBtn');

  dom.goalName     = $('goalName');
  dom.goalTarget   = $('goalTarget');
  dom.goalCurrent  = $('goalCurrent');
  dom.goalMode     = $('goalMode');
  dom.goalDuration = $('goalDuration');
  dom.goalSaveBtn  = $('goalSaveBtn');
  dom.goalResult   = $('goalResult');
  dom.grAmount     = $('grAmount');
  dom.grPer        = $('grPer');
  dom.grName       = $('grName');
  dom.grTargetDisplay = $('grTargetDisplay');
  dom.grBarFill    = $('grBarFill');
  dom.grInterest   = $('grInterest');
  dom.goalList     = $('goalList');
}

// ---------- LOCAL STORAGE HELPERS ----------
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ---------- DATA ACCESS ----------
function getTransactions() {
  return lsGet(STORAGE_TX, []);
}

function saveTransactions(tx) {
  lsSet(STORAGE_TX, tx);
}

function getGoals() {
  return lsGet(STORAGE_GOAL, []);
}

function saveGoals(goals) {
  lsSet(STORAGE_GOAL, goals);
}

function getMode() {
  return lsGet(STORAGE_MODE, 'deduct');
}

function saveMode(m) {
  lsSet(STORAGE_MODE, m);
}

function getSavingsBalance() {
  return lsGet(STORAGE_SAVINGS, 0);
}

function setSavingsBalance(val) {
  lsSet(STORAGE_SAVINGS, val);
}

function getTotalDeducted() {
  return lsGet(STORAGE_DEDUCTED, 0);
}

function setTotalDeducted(val) {
  lsSet(STORAGE_DEDUCTED, val);
}

// ---------- INTEREST ----------
function calcCompoundInterest(principal, days) {
  if (principal <= 0 || days <= 0) return 0;
  return principal * (Math.pow(1 + DAILY_RATE, days) - 1);
}

function calcTotalInterest() {
  const tx = getTransactions();
  if (tx.length === 0) return 0;

  let earliest = null;
  for (const t of tx) {
    if (t.type === 'income') {
      if (!earliest || t.date < earliest) earliest = t.date;
    }
  }
  if (!earliest) return 0;

  const start = new Date(earliest);
  const now = new Date();
  const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 0;

  const balance = getSavingsBalance();
  return calcCompoundInterest(balance, days);
}

// ---------- QUOTES ----------
function getRandomQuote() {
  const today = new Date().toDateString();
  const idx = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % QUOTES.length;
  return QUOTES[idx];
}

// ---------- CATEGORY ----------
function updateCategoryOptions() {
  const type = dom.txType.value;
  const cats = type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;
  dom.txCategory.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

// ---------- MODE ----------
function setMode(mode) {
  currentMode = mode;
  saveMode(mode);
  dom.modeDeduct.classList.toggle('active', mode === 'deduct');
  dom.modeRemain.classList.toggle('active', mode === 'remain');

  if (mode === 'deduct') {
    dom.modeDesc.textContent = 'รายรับเขา หักเงินออมตามเปาหมาย สวนที่เหลือคือคาใชจาย';
  } else {
    dom.modeDesc.textContent = 'รายรับ - รายจาย = เงินเหลือ เงินเหลือถูกสะสมเขาเปาหมายอัตโนมัติ';
  }

  recalcSavingsBalance();
  refreshAll();
}

// ---------- GOAL MATH ----------
function calcRequiredAmount(target, current, duration, mode) {
  const remain = target - current;
  if (remain <= 0) return 0;
  return remain / duration;
}

function getPerLabel(mode) {
  if (mode === 'daily') return '/วัน';
  if (mode === 'monthly') return '/เดือน';
  return '/ปี';
}

// ---------- SAVINGS ----------
function recalcSavingsBalance() {
  const tx = getTransactions();
  const goals = getGoals();
  const mode = getMode();

  if (mode === 'remain') {
    let totalIncome = 0, totalExpense = 0;
    for (const t of tx) {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    }
    const savings = Math.max(0, totalIncome - totalExpense);
    setSavingsBalance(savings);

    if (goals.length > 0) {
      let remaining = savings;
      for (const g of goals) {
        const capacity = g.target;
        g.current = Math.min(remaining, capacity);
        remaining -= g.current;
      }
      saveGoals(goals);
    }
  } else {
    const deducted = getTotalDeducted();
    setSavingsBalance(deducted);

    if (goals.length > 0) {
      let remaining = deducted;
      for (const g of goals) {
        const capacity = g.target;
        g.current = Math.min(remaining, capacity);
        remaining -= g.current;
      }
      saveGoals(goals);
    }
  }
}

function applyDeduction(incomeAmount) {
  const goals = getGoals();
  if (goals.length === 0 || incomeAmount <= 0) return;

  const goal = goals[0];
  const perAmount = calcRequiredAmount(goal.target, goal.current, goal.duration || 30, goal.mode || 'daily');
  if (isNaN(perAmount) || perAmount <= 0) return;

  const deduct = Math.min(perAmount, incomeAmount);
  const totalDeducted = getTotalDeducted() + deduct;
  setTotalDeducted(totalDeducted);

  goal.current = Math.min(goal.current + deduct, goal.target);
  saveGoals(goals);

  setSavingsBalance(totalDeducted);
}

function updateSavingsBalance(tx) {
  recalcSavingsBalance();
}

// ---------- RENDER ----------
function renderSummary() {
  const tx = getTransactions();
  const now = new Date();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  let monthIncome = 0, monthExpense = 0;
  for (const t of tx) {
    if (t.date && t.date.startsWith(monthStr)) {
      if (t.type === 'income') monthIncome += t.amount;
      else monthExpense += t.amount;
    }
  }

  const savings = getSavingsBalance();
  const interest = calcTotalInterest();

  dom.totalSavings.textContent = savings.toFixed(2);
  dom.monthIncome.textContent = monthIncome.toFixed(2);
  dom.monthExpense.textContent = monthExpense.toFixed(2);
  dom.totalInterest.textContent = interest.toFixed(2);
}

function renderMainGoal() {
  const goals = getGoals();
  if (goals.length === 0) {
    dom.gpTitle.textContent = 'ยังไม่มีเป้าหมาย เพิ่มเปาหมายดานลาง';
    dom.gpPercent.textContent = '—';
    dom.gpBarFill.style.width = '0%';
    dom.gpCurrent.textContent = '0';
    dom.gpTarget.textContent = '0';
    return;
  }

  const goal = goals[0];
  const percent = goal.target > 0 ? Math.min(100, (goal.current / goal.target) * 100) : 0;

  dom.gpTitle.textContent = goal.name;
  dom.gpPercent.textContent = percent.toFixed(0) + '%';
  dom.gpBarFill.style.width = percent + '%';
  dom.gpCurrent.textContent = goal.current.toFixed(0);
  dom.gpTarget.textContent = goal.target.toFixed(0);
}

function renderQuote() {
  dom.quoteText.textContent = getRandomQuote();
}

function renderTransactions() {
  let tx = getTransactions();
  const filter = dom.txFilter.value;

  if (filter !== 'all') {
    tx = tx.filter(t => t.type === filter);
  }

  if (tx.length === 0) {
    dom.txTable.innerHTML = '<div class="tx-empty">ยังไม่มีรายการ เพิ่มรายการแรกของคุณ</div>';
    return;
  }

  let html = `
    <div class="tx-row tx-row-header">
      <span>รายละเอียด</span>
      <span>ประเภท</span>
      <span>หมวดหมู่</span>
      <span style="text-align:right">จํานวนเงิน</span>
      <span>วันที่</span>
      <span></span>
    </div>
  `;

  for (let i = tx.length - 1; i >= 0; i--) {
    const t = tx[i];
    const typeClass = t.type === 'income' ? 'tx-type-income' : 'tx-type-expense';
    const amountClass = t.type === 'income' ? 'tx-amount-income' : 'tx-amount-expense';
    const typeLabel = t.type === 'income' ? 'รายรับ' : 'รายจ่าย';
    const sign = t.type === 'income' ? '+' : '−';

    html += `
      <div class="tx-row">
        <span>${escHtml(t.note || '—')}</span>
        <span><span class="tx-type ${typeClass}">${typeLabel}</span></span>
        <span>${escHtml(t.category || '—')}</span>
        <span class="tx-amount ${amountClass}">${sign} ${t.amount.toFixed(2)}</span>
        <span class="tx-date">${formatDate(t.date)}</span>
        <button class="tx-delete" data-tx-index="${i}" title="ลบ">✕</button>
      </div>
    `;
  }

  dom.txTable.innerHTML = html;

  dom.txTable.querySelectorAll('.tx-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.txIndex);
      deleteTransaction(idx);
    });
  });
}

function renderGoalPreview() {
  const name = dom.goalName.value.trim();
  const target = parseFloat(dom.goalTarget.value);
  const current = parseFloat(dom.goalCurrent.value) || 0;
  const mode = dom.goalMode.value;
  const duration = parseInt(dom.goalDuration.value);

  if (!name || isNaN(target) || target <= 0 || isNaN(duration) || duration <= 0) {
    dom.goalResult.classList.add('hidden');
    return;
  }

  const perAmount = calcRequiredAmount(target, current, duration, mode);
  const perLabel = getPerLabel(mode);
  const percent = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  dom.grAmount.textContent = perAmount.toFixed(2);
  dom.grPer.textContent = perLabel;
  dom.grName.textContent = name;
  dom.grTargetDisplay.textContent = target.toFixed(0);
  dom.grBarFill.style.width = percent + '%';

  const avgBalance = (current + target) / 2;
  let totalDays = duration;
  if (mode === 'monthly') totalDays = duration * 30;
  if (mode === 'yearly') totalDays = duration * 365;
  const estInterest = calcCompoundInterest(avgBalance, Math.floor(totalDays / 2));
  dom.grInterest.textContent = estInterest.toFixed(2);

  dom.goalResult.classList.remove('hidden');
}

function renderGoals() {
  const goals = getGoals();

  if (goals.length === 0) {
    dom.goalList.innerHTML = '<p style="color:var(--c-text-light);text-align:center;padding:16px;">ยังไม่มีเป้าหมาย เพิ่มเป้าหมายแรกเลย!</p>';
    return;
  }

  let html = '';
  for (let i = 0; i < goals.length; i++) {
    const g = goals[i];
    const percent = g.target > 0 ? Math.min(100, (g.current / g.target) * 100) : 0;
    const perLabel = getPerLabel(g.mode || 'daily');

    html += `
      <div class="goal-item">
        <div class="gi-info">
          <h4>${escHtml(g.name)}</h4>
          <p>${g.current.toFixed(0)} / ${g.target.toFixed(0)} บาท (${perLabel.trim()})</p>
        </div>
        <div class="gi-progress">
          <div class="gi-percent">${percent.toFixed(0)}%</div>
          <div class="gi-sub">สำเร็จ</div>
        </div>
        <div class="gi-actions">
          <button class="gi-select" data-goal-index="${i}">✓ ใช้เป็นเป้าหมายหลัก</button>
          <button class="gi-delete" data-goal-index="${i}">ลบ</button>
        </div>
      </div>
    `;
  }

  dom.goalList.innerHTML = html;

  dom.goalList.querySelectorAll('.gi-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.goalIndex);
      deleteGoal(idx);
    });
  });

  dom.goalList.querySelectorAll('.gi-select').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.goalIndex);
      promoteGoal(idx);
    });
  });
}

// ---------- CRUD: TRANSACTIONS ----------
function addTransaction(type, category, amount, note, date) {
  if (isNaN(amount) || amount <= 0) {
    alert('กรุณากรอกจํานวนเงินที่ถูกตอง');
    return false;
  }

  const tx = getTransactions();
  tx.push({
    id: Date.now(),
    type,
    category,
    amount: parseFloat(amount),
    note: note.trim(),
    date
  });
  saveTransactions(tx);

  const mode = getMode();
  if (mode === 'deduct' && type === 'income') {
    applyDeduction(amount);
  }
  recalcSavingsBalance();

  return true;
}

function deleteTransaction(index) {
  if (!confirm('ลบรายการนี้?')) return;
  const tx = getTransactions();
  tx.splice(index, 1);
  saveTransactions(tx);
  recalcSavingsBalance();
  refreshAll();
}

function clearAllTransactions() {
  if (!confirm('ลบรายการทั้งหมด?')) return;
  saveTransactions([]);
  setSavingsBalance(0);
  setTotalDeducted(0);
  refreshAll();
}

// ---------- CRUD: GOALS ----------
function addGoal(name, target, current, mode, duration) {
  const goals = getGoals();
  goals.push({
    id: Date.now(),
    name: name.trim(),
    target: parseFloat(target),
    current: parseFloat(current) || 0,
    mode,
    duration: parseInt(duration),
    createdAt: new Date().toISOString()
  });
  saveGoals(goals);
  return true;
}

function deleteGoal(index) {
  if (!confirm('ลบเป้าหมายนี้?')) return;
  const goals = getGoals();
  goals.splice(index, 1);
  saveGoals(goals);
  refreshAll();
}

function promoteGoal(index) {
  const goals = getGoals();
  if (index === 0) return;
  const item = goals.splice(index, 1)[0];
  goals.unshift(item);
  saveGoals(goals);
  refreshAll();
}

// ---------- CHARTS ----------
function drawBarChart() {
  const canvas = dom.chartBar;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const tx = getTransactions();
  const monthly = {};
  for (const t of tx) {
    if (!t.date) continue;
    const prefix = t.date.substring(0, 7);
    if (!monthly[prefix]) monthly[prefix] = { income: 0, expense: 0 };
    if (t.type === 'income') monthly[prefix].income += t.amount;
    else monthly[prefix].expense += t.amount;
  }

  const keys = Object.keys(monthly).sort().slice(-6);
  if (keys.length === 0) {
    ctx.fillStyle = '#BDC3C7';
    ctx.font = '13px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ยังไม่มีข้อมูล', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...keys.map(k => monthly[k].income), 1);
  const barW = (w - 80) / keys.length * 0.6;
  const gap = (w - 80) / keys.length;

  ctx.font = '10px Sarabun, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7F8C8D';
  keys.forEach((k, i) => {
    const x = 50 + i * gap + gap / 2;
    const parts = k.split('-');
    const label = MONTHS_TH[parseInt(parts[1]) - 1] || k;
    ctx.fillText(label, x, h - 4);
  });

  keys.forEach((k, i) => {
    const x = 50 + i * gap + (gap - barW) / 2;
    const incomeH = (monthly[k].income / maxVal) * (h - 40);
    const expenseH = (monthly[k].expense / maxVal) * (h - 40);

    ctx.fillStyle = '#2ECC71';
    ctx.fillRect(x, h - 28 - incomeH, barW / 2 - 2, incomeH);
    ctx.fillStyle = '#E74C3C';
    ctx.fillRect(x + barW / 2 + 2, h - 28 - expenseH, barW / 2 - 2, expenseH);
  });

  ctx.font = '10px Sarabun, sans-serif';
  ctx.fillStyle = '#2ECC71';
  ctx.fillRect(20, 8, 12, 12);
  ctx.fillStyle = '#2C3E50';
  ctx.textAlign = 'left';
  ctx.fillText('รายรับ', 36, 18);
  ctx.fillStyle = '#E74C3C';
  ctx.fillRect(80, 8, 12, 12);
  ctx.fillStyle = '#2C3E50';
  ctx.fillText('รายจ่าย', 96, 18);
}

function drawLineChart() {
  const canvas = dom.chartLine;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const tx = getTransactions();
  const sorted = [...tx].filter(t => t.date).sort((a, b) => a.date.localeCompare(b.date));

  const monthlyBalance = {};
  let runningBalance = 0;
  for (const t of sorted) {
    const prefix = t.date.substring(0, 7);
    if (t.type === 'income') runningBalance += t.amount;
    else runningBalance -= t.amount;
    monthlyBalance[prefix] = runningBalance;
  }

  const keys = Object.keys(monthlyBalance).sort().slice(-8);
  if (keys.length < 2) {
    ctx.fillStyle = '#BDC3C7';
    ctx.font = '13px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ยังไม่มีข้อมูลเพียงพอ', w / 2, h / 2);
    return;
  }

  const values = keys.map(k => monthlyBalance[k]);
  const minVal = Math.min(...values, 0);
  const maxVal = Math.max(...values, 1);
  const range = maxVal - minVal || 1;
  const padX = 50, padY = 20;

  ctx.strokeStyle = '#ECF0F1';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padY + (h - padY * 2) * (1 - i / 4);
    ctx.beginPath();
    ctx.moveTo(padX, y);
    ctx.lineTo(w - 10, y);
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.strokeStyle = '#3AAFA9';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';

  const stepX = (w - padX - 10) / (keys.length - 1);
  values.forEach((v, i) => {
    const x = padX + i * stepX;
    const y = padY + (h - padY * 2) * (1 - (v - minVal) / range);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = '#3AAFA9';
  values.forEach((v, i) => {
    const x = padX + i * stepX;
    const y = padY + (h - padY * 2) * (1 - (v - minVal) / range);
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = '10px Sarabun, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7F8C8D';
  keys.forEach((k, i) => {
    const x = padX + i * stepX;
    const parts = k.split('-');
    const label = MONTHS_TH[parseInt(parts[1]) - 1] || k;
    ctx.fillText(label, x, h - 4);
  });
}

function drawPieChart() {
  const canvas = dom.chartPie;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const tx = getTransactions();
  const expenses = tx.filter(t => t.type === 'expense');

  if (expenses.length === 0) {
    ctx.fillStyle = '#BDC3C7';
    ctx.font = '13px Sarabun, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ยังไม่มีรายจาย', w / 2, h / 2);
    return;
  }

  const catTotals = {};
  for (const e of expenses) {
    const cat = e.category || 'อื่น ๆ';
    catTotals[cat] = (catTotals[cat] || 0) + e.amount;
  }

  const total = Object.values(catTotals).reduce((a, b) => a + b, 0);
  if (total <= 0) return;

  const colors = [
    '#2ECC71', '#E74C3C', '#F39C12', '#3498DB',
    '#9B59B6', '#1ABC9C', '#E67E22', '#2C3E50',
    '#95A5A6'
  ];

  const cx = 100, cy = h / 2, radius = 70;
  let startAngle = -Math.PI / 2;
  const entries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  entries.forEach(([cat, amt], i) => {
    const sliceAngle = (amt / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    startAngle += sliceAngle;
  });

  ctx.font = '11px Sarabun, sans-serif';
  ctx.textAlign = 'left';
  let ly = 20;
  entries.slice(0, 6).forEach(([cat, amt], i) => {
    const pct = ((amt / total) * 100).toFixed(1);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(180, ly, 10, 10);
    ctx.fillStyle = '#2C3E50';
    ctx.fillText(`${cat} (${pct}%)`, 196, ly + 9);
    ly += 20;
  });

  if (entries.length > 6) {
    ctx.fillStyle = '#7F8C8D';
    ctx.fillText(`+${entries.length - 6} หมวดอื่น ๆ`, 196, ly + 9);
  }
}

function drawAllCharts() {
  drawBarChart();
  drawLineChart();
  drawPieChart();
}

// ---------- UTILITY ----------
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// ---------- REFRESH ----------
function refreshAll() {
  renderSummary();
  renderMainGoal();
  renderQuote();
  renderTransactions();
  renderGoals();
  drawAllCharts();
}

// ---------- EVENTS ----------
function setupEvents() {
  dom.modeDeduct.addEventListener('click', () => setMode('deduct'));
  dom.modeRemain.addEventListener('click', () => setMode('remain'));

  dom.txType.addEventListener('change', updateCategoryOptions);

  dom.txSaveBtn.addEventListener('click', function() {
    const type = dom.txType.value;
    const category = dom.txCategory.value;
    const amount = parseFloat(dom.txAmount.value);
    const note = dom.txNote.value;
    const date = dom.txDate.value || getTodayStr();

    if (addTransaction(type, category, amount, note, date)) {
      dom.txAmount.value = '';
      dom.txNote.value = '';
      dom.txDate.value = getTodayStr();
      refreshAll();
    }
  });

  dom.txFilter.addEventListener('change', renderTransactions);
  dom.txClearBtn.addEventListener('click', clearAllTransactions);

  dom.goalName.addEventListener('input', renderGoalPreview);
  dom.goalTarget.addEventListener('input', renderGoalPreview);
  dom.goalCurrent.addEventListener('input', renderGoalPreview);
  dom.goalMode.addEventListener('change', renderGoalPreview);
  dom.goalDuration.addEventListener('input', renderGoalPreview);

  dom.goalSaveBtn.addEventListener('click', function() {
    const name = dom.goalName.value.trim();
    const target = parseFloat(dom.goalTarget.value);
    const current = parseFloat(dom.goalCurrent.value) || 0;
    const mode = dom.goalMode.value;
    const duration = parseInt(dom.goalDuration.value);

    if (!name) { alert('กรุณากรอกชื่อเป้าหมาย'); return; }
    if (isNaN(target) || target <= 0) { alert('กรุณากรอกเงินเป้าหมายที่ถูกตอง'); return; }
    if (isNaN(duration) || duration <= 0) { alert('กรุณากรอกจํานวนระยะเวลา'); return; }

    addGoal(name, target, current, mode, duration);

    dom.goalName.value = '';
    dom.goalTarget.value = '';
    dom.goalCurrent.value = '';
    dom.goalDuration.value = '';
    dom.goalResult.classList.add('hidden');

    refreshAll();
  });
}

// ---------- INIT ----------
function init() {
  cacheDom();
  currentMode = getMode();
  setMode(currentMode);

  dom.txDate.value = getTodayStr();
  updateCategoryOptions();

  setupEvents();
  refreshAll();
}

document.addEventListener('DOMContentLoaded', init);
