/* ============================================================
   C for cFS — Learning Site  |  app.js
   ============================================================ */

/* ── Navigation structure ─────────────────────────────── */
const NAV = [
  { id: 'home', label: 'Overview', phase: null },
  {
    id: 'phase1', label: 'Phase 1 · Low-Level Foundations', color: '--ph1',
    topics: [
      { id: 'p1t1', label: 'Exact-Width Types & Endianness' },
      { id: 'p1t2', label: 'Pointers in Depth' },
      { id: 'p1t3', label: 'Structs, Unions & Memory Layout' },
    ]
  },
  {
    id: 'phase2', label: 'Phase 2 · Safety-Critical C', color: '--ph2',
    topics: [
      { id: 'p2t1', label: 'Deterministic Memory Management' },
      { id: 'p2t2', label: 'Defensive Programming & Error Handling' },
      { id: 'p2t3', label: 'Hardware Modifiers: volatile, const, static' },
    ]
  },
  {
    id: 'phase3', label: 'Phase 3 · Systems & RTOS', color: '--ph3',
    topics: [
      { id: 'p3t1', label: 'Concurrency & Thread Safety' },
      { id: 'p3t2', label: 'Inter-Task Communication (IPC)' },
      { id: 'p3t3', label: 'Timers & Clocks' },
    ]
  },
  {
    id: 'phase4', label: 'Phase 4 · cFS Architecture', color: '--ph4',
    topics: [
      { id: 'p4t1', label: 'cFE Core Services Overview' },
      { id: 'p4t2', label: 'Software Bus (CFE_SB)' },
      { id: 'p4t3', label: 'App Structure & Lifecycle' },
      { id: 'p4t4', label: 'Command Dispatch Tables' },
      { id: 'p4t5', label: 'Table & Event Services' },
      { id: 'p4t6', label: 'CCSDS Packets in C' },
    ]
  },
  {
    id: 'phase5', label: 'Phase 5 · Tooling & Verification', color: '--ph5',
    topics: [
      { id: 'p5t1', label: 'CMake for cFS' },
      { id: 'p5t2', label: 'Static & Dynamic Analysis' },
      { id: 'p5t3', label: 'Unit Testing with UT-Assert' },
    ]
  }
];

const ALL_IDS = NAV.flatMap(p =>
  p.topics ? p.topics.map(t => t.id) : [p.id]
);
const TOPIC_IDS = NAV.flatMap(p =>
  p.topics ? p.topics.map(t => t.id) : []
);

let currentSection = 'home';
let completed = JSON.parse(localStorage.getItem('cfs_done') || '[]');
let currentTheme = localStorage.getItem('cfs_theme') || 'black-metal';

/* ── Theme ──────────────────────────────────────────────── */
function applyTheme(t) {
  currentTheme = t;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('cfs_theme', t);
  document.querySelectorAll('.th-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.theme === t)
  );
}

/* ── Navigation ─────────────────────────────────────────── */
function navigateTo(id) {
  if (!document.getElementById(id)) return;

  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  currentSection = id;

  document.querySelectorAll('.nav-topic, .nav-home').forEach(el =>
    el.classList.toggle('active', el.dataset.sec === id)
  );

  // Open parent phase
  NAV.forEach(p => {
    if (p.topics && p.topics.some(t => t.id === id)) {
      const phEl = document.querySelector(`.nav-phase[data-phase="${p.id}"]`);
      if (phEl) phEl.classList.add('open');
    }
  });

  updateBreadcrumb(id);
  window.scrollTo(0, 0);
  window.location.hash = id;

  if (id !== 'home' && !completed.includes(id)) {
    completed.push(id);
    localStorage.setItem('cfs_done', JSON.stringify(completed));
  }
  updateProgress();

  // Mark nav item done
  document.querySelectorAll(`.nav-topic[data-sec="${id}"]`).forEach(el =>
    el.classList.add('done')
  );

  document.querySelector('.sidebar')?.classList.remove('open');
  if (typeof Prism !== 'undefined') Prism.highlightAllUnder(document.getElementById(id));
}

function updateBreadcrumb(id) {
  const bc = document.querySelector('.breadcrumb');
  let html = `<span style="cursor:pointer" onclick="navigateTo('home')">C for cFS</span>`;

  for (const phase of NAV) {
    if (phase.id === id) {
      html += `<span class="bc-sep">›</span><span class="bc-cur">${phase.label}</span>`;
      break;
    }
    if (phase.topics) {
      const t = phase.topics.find(x => x.id === id);
      if (t) {
        html += `<span class="bc-sep">›</span>`;
        html += `<span style="cursor:pointer;color:var(--fg-dim)" onclick="navigateTo('${phase.id}')">${phase.label}</span>`;
        html += `<span class="bc-sep">›</span><span class="bc-cur">${t.label}</span>`;
        break;
      }
    }
  }

  bc.innerHTML = html;
}

function updateProgress() {
  const total = TOPIC_IDS.length;
  const done  = completed.filter(id => TOPIC_IDS.includes(id)).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill  = document.querySelector('.prog-fill');
  const cnt   = document.querySelector('.prog-count');
  const pctEl = document.querySelector('.prog-pct');
  if (fill)  fill.style.width = pct + '%';
  if (cnt)   cnt.textContent  = `${done}/${total}`;
  if (pctEl) pctEl.textContent= pct + '%';
}

function nextSec() {
  const idx = ALL_IDS.indexOf(currentSection);
  if (idx < ALL_IDS.length - 1) navigateTo(ALL_IDS[idx + 1]);
}

function prevSec() {
  const idx = ALL_IDS.indexOf(currentSection);
  if (idx > 0) navigateTo(ALL_IDS[idx - 1]);
}

/* ── Code helpers ───────────────────────────────────────── */
function copyCode(btn) {
  const pre = btn.closest('.cb').querySelector('code');
  navigator.clipboard.writeText(pre.textContent).then(() => {
    showToast('✓ Copied to clipboard');
    const orig = btn.textContent;
    btn.textContent = '✓ Copied';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

function copyEd(btn) {
  const ed = btn.closest('.prac').querySelector('.code-ed');
  navigator.clipboard.writeText(ed.value).then(() => showToast('✓ Code copied'));
}

function resetEd(btn) {
  const ed = btn.closest('.prac').querySelector('.code-ed');
  ed.value = ed.dataset.orig;
  showToast('Editor reset to template');
}
function resetEditor(btn) {
  resetEd(btn);
}

async function openGodbolt(btn) {
  const isEd = btn.closest('.prac');
  const code = isEd
    ? btn.closest('.prac').querySelector('.code-ed').value
    : btn.closest('.cb').querySelector('code').textContent;

  const orig = btn.textContent;
  btn.textContent = '⏳';

  try {
    const res = await fetch('https://godbolt.org/api/shortener', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        sessions: [{
          id: 1, language: 'c', source: code,
          compilers: [{ id: 'cg132', options: '-O0 -std=c99 -Wall -Wextra' }]
        }]
      })
    });
    const data = await res.json();
    window.open(data.url, '_blank');
  } catch {
    await navigator.clipboard.writeText(code);
    window.open('https://godbolt.org/', '_blank');
    showToast('Code copied — paste in Godbolt');
  }
  btn.textContent = orig;
}

/* ── Quiz ────────────────────────────────────────────────── */
function answerQuiz(el, correct) {
  const quiz = el.closest('.quiz');
  if (quiz.dataset.done) return;
  quiz.dataset.done = '1';

  quiz.querySelectorAll('.quiz-opt').forEach(o => { o.style.cursor = 'default'; });
  el.classList.add(correct ? 'correct' : 'wrong');
  if (!correct)
    quiz.querySelector('.quiz-opt[data-correct]')?.classList.add('correct');

  quiz.querySelector('.quiz-expl')?.classList.add('show');
  showToast(correct ? '✓ Correct!' : '✗ Not quite — check the explanation', correct ? 'ok' : 'err');
}

/* ── Toast ───────────────────────────────────────────────── */
let toastTimer;
function showToast(msg, type = 'info') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.style.borderColor = type === 'ok'  ? 'var(--green-bright)'
                      : type === 'err' ? 'var(--red-bright)'
                      : 'var(--accent)';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Search ──────────────────────────────────────────────── */
function initSearch() {
  const inp = document.querySelector('.sb-search input');
  if (!inp) return;
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase().trim();
    document.querySelectorAll('.nav-topic').forEach(el => {
      el.style.display = (!q || el.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
    if (q) document.querySelectorAll('.nav-phase').forEach(p => p.classList.add('open'));
  });
}

/* ── Tab & Navigation keys ────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.target.classList.contains('code-ed') && e.key === 'Tab') {
    e.preventDefault();
    const s = e.target.selectionStart, en = e.target.selectionEnd;
    e.target.value = e.target.value.slice(0, s) + '    ' + e.target.value.slice(en);
    e.target.selectionStart = e.target.selectionEnd = s + 4;
    return;
  }
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    if (e.key === 'ArrowRight') nextSec();
    if (e.key === 'ArrowLeft') prevSec();
  }
});

/* ── Build sidebar from NAV ─────────────────────────────── */
function buildSidebar() {
  const tree = document.querySelector('.nav-tree');
  if (!tree) return;

  // Home link
  const homeEl = document.createElement('div');
  homeEl.className = 'nav-home';
  homeEl.dataset.sec = 'home';
  homeEl.innerHTML = '<span>🏠</span><span>Overview</span>';
  homeEl.addEventListener('click', () => navigateTo('home'));
  tree.appendChild(homeEl);

  NAV.filter(p => p.topics).forEach(phase => {
    const phEl = document.createElement('div');
    phEl.className = 'nav-phase';
    phEl.dataset.phase = phase.id;

    const colorVal = `var(${phase.color})`;

    phEl.innerHTML = `
      <div class="nav-ph-hd">
        <span class="ph-dot" style="background:${colorVal}"></span>
        <span>${phase.label}</span>
        <span class="ph-chevron">▶</span>
      </div>
      <div class="nav-topics"></div>`;

    phEl.querySelector('.nav-ph-hd').addEventListener('click', () =>
      phEl.classList.toggle('open')
    );

    const topicsEl = phEl.querySelector('.nav-topics');
    phase.topics.forEach(t => {
      const tEl = document.createElement('div');
      tEl.className = 'nav-topic' + (completed.includes(t.id) ? ' done' : '');
      tEl.dataset.sec = t.id;
      tEl.textContent = t.label;
      tEl.addEventListener('click', () => navigateTo(t.id));
      topicsEl.appendChild(tEl);
    });

    tree.appendChild(phEl);
  });
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  buildSidebar();
  initSearch();
  updateProgress();

  // Mobile menu
  document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });
  document.addEventListener('click', e => {
    const sb = document.querySelector('.sidebar');
    const mt = document.querySelector('.menu-toggle');
    if (sb?.classList.contains('open') && !sb.contains(e.target) && !mt?.contains(e.target))
      sb.classList.remove('open');
  });

  // Route
  const hash = window.location.hash.slice(1);
  navigateTo(hash && document.getElementById(hash) ? hash : 'home');
});
