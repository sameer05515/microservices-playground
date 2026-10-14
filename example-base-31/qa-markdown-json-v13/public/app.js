const $ = s => document.querySelector(s);
const list = $('#list');
let timer;
let tagsCache = [];
let originalAnswers = [];
let answersChanged = false;

function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('qa-theme', theme);
  $('#themeBtn').textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}
const savedTheme = localStorage.getItem('qa-theme');
const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(initialTheme);
$('#themeBtn').onclick = () => applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
async function api(url, options) {
  const r = await fetch(url, { headers: {'Content-Type':'application/json'}, ...options });
  if (!r.ok) throw new Error((await r.json()).error || 'Request failed');
  return r.status === 204 ? null : r.json();
}
function md(text) {
  const value = text || '';
  if (window.marked && typeof window.marked.parse === 'function') {
    return window.marked.parse(value, { gfm: true });
  }
  return esc(value).replace(/\n/g, '<br>');
}
function highlightCode(root = document) {
  if (!window.hljs) return;
  root.querySelectorAll('pre code').forEach(block => {
    if (!block.dataset.highlighted) window.hljs.highlightElement(block);
  });
}
function tagName(id) { return tagsCache.find(t => t.id === id)?.name || id; }

async function loadTags() { tagsCache = await api('/api/tags'); }
async function load() {
  const match = window.location.pathname.match(/^\/question\/([^/]+)\/?$/);
  if (match) return loadQuestionPage(decodeURIComponent(match[1]));
  const data = await api('/api/questions?q=' + encodeURIComponent($('#search').value));
  const questions = Array.isArray(data) ? data : (data?.questions || []);
  if (!$('#search').value.trim()) updateStudyBadge(questions);
  $('#count').textContent = `${questions.length} question${questions.length === 1 ? '' : 's'}`;
  list.innerHTML = questions.length ? questions.map(render).join('') : '<div class="py-16 text-center text-slate-500">No questions found.</div>';
  highlightCode(list);
}


async function loadQuestionPage(id) {
  try {
    const [question, allQuestions] = await Promise.all([
      api('/api/questions/' + encodeURIComponent(id)),
      api('/api/questions')
    ]);
    const questions = Array.isArray(allQuestions) ? allQuestions : (allQuestions?.questions || []);
    updateStudyBadge(questions);
    const currentIndex = questions.findIndex(q => q.id === id);
    const previous = questions[(currentIndex - 1 + questions.length) % questions.length];
    const next = questions[(currentIndex + 1) % questions.length];
    document.title = `${question.question} — Markdown Q&A`;
    $('#search').parentElement.classList.add('hidden');
    $('#count').textContent = `${currentIndex + 1} / ${questions.length}`;
    list.innerHTML = `<div class="mb-5 flex flex-wrap items-center justify-between gap-2">
      <a href="/" class="inline-flex items-center rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600">← All Questions</a>
      <div class="flex gap-2">
        <a href="/question/${encodeURIComponent(previous.id)}" class="inline-flex items-center rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-500">← Previous</a>
        <a href="/question/${encodeURIComponent(next.id)}" class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Next →</a>
      </div>
    </div>${render(question, true)}
    <div class="mt-5 flex justify-between gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">
      <a href="/question/${encodeURIComponent(previous.id)}" class="rounded-lg bg-slate-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-500">← Previous</a>
      <a href="/question/${encodeURIComponent(next.id)}" class="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Next →</a>
    </div>`;
    highlightCode(list);
  } catch (e) {
    $('#search').parentElement.classList.add('hidden');
    $('#count').textContent = '';
    list.innerHTML = `<div class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"><h2 class="text-xl font-bold">Question not found</h2><p class="mt-2">${esc(e.message)}</p><a href="/" class="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Back to Questions</a></div>`;
  }
}
function render(x, detail = false) {
  return `<article class="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-3 flex justify-end gap-2">${detail ? '' : `<a href="/question/${encodeURIComponent(x.id)}" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500">View</a>`}<button class="rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-500" onclick="editQ('${x.id}')">Edit</button><button class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500" onclick="deleteQ('${x.id}')">Delete</button></div>
    <h2 class="text-xl font-bold">${esc(x.question)}</h2>
    <div class="my-3 flex flex-wrap gap-2">${(x.tags||[]).map(t=>`<span class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">${esc(tagName(t))}</span>`).join('')}</div>
    ${(x.answers||[]).map(a=>`<div class="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800"><h3 class="mb-2 font-semibold">${esc(a.title)}</h3><div class="md text-sm leading-7">${md(a.markdown)}</div></div>`).join('')}
  </article>`;
}
function tagCheckboxes(selected = []) {
  return tagsCache.length ? tagsCache.map(t => `<label class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700"><input type="checkbox" class="tag-check h-4 w-4" value="${esc(t.id)}" ${selected.includes(t.id) ? 'checked' : ''}><span class="text-sm">${esc(t.name)}</span></label>`).join('') : '<p class="text-sm text-slate-500">No tags yet. Create one from Manage Tags.</p>';
}
function answerEditor(a = {}, markChanged = false) {
  if (typeof a === 'string') a = { title: 'Answer', markdown: a };
  const div = document.createElement('div');
  div.className = 'my-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950 answer-editor';
  div.dataset.id = a.id || '';
  div.innerHTML = `<div class="flex gap-2"><input class="atitle min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Answer title"><button type="button" class="remove-answer rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white">Remove</button></div><textarea class="amarkdown mt-3 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Write Markdown here..."></textarea>`;
  div.querySelector('.atitle').value = a.title || 'Answer';
  div.querySelector('.amarkdown').value = a.markdown || '';
  div.querySelector('.atitle').addEventListener('input', () => { answersChanged = true; });
  div.querySelector('.amarkdown').addEventListener('input', () => { answersChanged = true; });
  div.querySelector('.remove-answer').addEventListener('click', () => {
    answersChanged = true;
    div.remove();
  });
  $('#answers').appendChild(div);
  if (markChanged) answersChanged = true;
}
function open(item) {
  answersChanged = false;
  $('#modal').classList.remove('hidden'); $('#modal').classList.add('flex');
  $('#qid').value = item?.id || ''; $('#modalTitle').textContent = item ? 'Edit Question' : 'New Question';
  $('#question').value = item?.question || '';
  $('#tagChecks').innerHTML = tagCheckboxes(item?.tags || []);
  originalAnswers = Array.isArray(item?.answers) ? JSON.parse(JSON.stringify(item.answers)) : [];
  $('#answers').innerHTML = '';
  if (item?.answers?.length) {
    item.answers.forEach(a => answerEditor(a, false));
  } else if (!item) {
    answerEditor({}, false);
  }
}
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').classList.remove('flex'); }

async function openTags() { $('#tagsModal').classList.remove('hidden'); $('#tagsModal').classList.add('flex'); await renderTags(); }
function closeTags() { $('#tagsModal').classList.add('hidden'); $('#tagsModal').classList.remove('flex'); }
async function renderTags() {
  tagsCache = await api('/api/tags');
  $('#tagList').innerHTML = tagsCache.length ? tagsCache.map(t => `<div class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700"><span class="font-medium">${esc(t.name)}</span><div class="flex gap-2"><button class="rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white" onclick="editTag('${t.id}')">Edit</button><button class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white" onclick="deleteTag('${t.id}')">Delete</button></div></div>`).join('') : '<p class="py-8 text-center text-sm text-slate-500">No tags found.</p>';
}
window.editTag = async tagId => {
  const tag = await api('/api/tags/' + tagId);
  const name = prompt('Tag name:', tag.name);
  if (name === null) return;
  try { await api('/api/tags/' + tagId, {method:'PUT', body:JSON.stringify({name})}); await renderTags(); await load(); } catch(e) { alert(e.message); }
};
window.deleteTag = async tagId => {
  const tag = await api('/api/tags/' + tagId);
  if (!confirm(`Delete tag "${tag.name}"? It will also be removed from questions.`)) return;
  try { await api('/api/tags/' + tagId, {method:'DELETE'}); await renderTags(); await load(); } catch(e) { alert(e.message); }
};
$('#createTag').onclick = async () => {
  const name = $('#newTagName').value.trim();
  if (!name) return;
  try { await api('/api/tags', {method:'POST', body:JSON.stringify({name})}); $('#newTagName').value=''; await renderTags(); await load(); } catch(e) { alert(e.message); }
};

$('#exportBtn').onclick = () => { window.location.href = '/api/export'; };
$('#importBtn').onclick = () => $('#importFile').click();
$('#importFile').onchange = async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!confirm('Import this JSON file? Existing questions and tags will be replaced.')) { e.target.value = ''; return; }
  try {
    const data = JSON.parse(await file.text());
    const result = await api('/api/import', { method: 'POST', body: JSON.stringify(data) });
    alert(`Imported ${result.questions} questions and ${result.tags} tags.`);
    await loadTags();
    await load();
  } catch (err) { alert(err.message || 'Import failed'); }
  finally { e.target.value = ''; }
};
$('#newBtn').onclick = () => open();
$('#manageTagsBtn').onclick = openTags;
$('#closeTagsBtn').onclick = closeTags;
$('#closeBtn').onclick = closeModal;
$('#cancelBtn').onclick = closeModal;
$('#addAnswer').onclick = () => answerEditor({}, true);
$('#search').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 200); };
$('#form').onsubmit = async e => {
  e.preventDefault();
  const answersContainer = $('#answers');
  const editors = answersContainer ? [...answersContainer.querySelectorAll(':scope > .answer-editor')] : [];
  const answers = editors.map(x => ({
    id: x.dataset.id || undefined,
    title: x.querySelector('.atitle').value.trim(),
    markdown: x.querySelector('.amarkdown').value
  }));
  const tags = [...document.querySelectorAll('.tag-check:checked')].map(x => x.value);
  const body = {question:$('#question').value,tags};
  if (!$('#qid').value || answersChanged) body.answers = answers;
  if ($('#qid').value) body.answersChanged = answersChanged;
  const id = $('#qid').value;
  try { await api(id ? `/api/questions/${id}` : '/api/questions', {method:id ? 'PUT' : 'POST', body:JSON.stringify(body)}); closeModal(); await load(); } catch(e) { alert(e.message); }
};
window.editQ = async id => open(await api('/api/questions/' + id));
window.deleteQ = async id => { if (confirm('Delete this question?')) { await api('/api/questions/' + id, {method:'DELETE'}); load(); } };

// Active Recall + Spaced Repetition. Review state is kept in this browser's localStorage;
// question/answer content continues to be stored by the existing MongoDB APIs.
const REVIEW_STORAGE_KEY = 'qa-review-progress-v1';
let studyQuestions = [];
let studyQueue = [];
let studyIndex = 0;
let studyRevealed = false;
let studySessionReviewed = 0;

function readReviewState() {
  try {
    const value = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function writeReviewState(state) { localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state)); }
function reviewInfo(questionId, state = readReviewState()) { return state[questionId] || null; }
function dueAt(questionId, state = readReviewState()) {
  const info = reviewInfo(questionId, state);
  return info ? Number(info.dueAt || 0) : 0;
}
function reviewStats(questions) {
  const state = readReviewState();
  const now = Date.now();
  let due = 0, fresh = 0, learning = 0, mastered = 0;
  for (const q of questions) {
    const info = state[q.id];
    if (!info) fresh++;
    else if (Number(info.dueAt || 0) <= now) due++;
    if (info && Number(info.intervalDays || 0) >= 1 && Number(info.intervalDays || 0) < 21) learning++;
    if (info && Number(info.intervalDays || 0) >= 21) mastered++;
  }
  return { due, fresh, learning, mastered, total: questions.length };
}
function updateStudyBadge(questions) {
  if (!Array.isArray(questions)) return;
  const stats = reviewStats(questions);
  const badge = $('#dueBadge');
  if (badge) badge.textContent = String(stats.due + stats.fresh);
}
function humanInterval(ms) {
  if (ms <= 0) return 'now';
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  const days = Math.ceil(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}
function escapeForInline(value) { return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

async function loadStudy() {
  try {
    const data = await api('/api/questions');
    studyQuestions = Array.isArray(data) ? data : (data?.questions || []);
    updateStudyBadge(studyQuestions);
    const now = Date.now();
    const state = readReviewState();
    // Active recall queue: overdue cards first, then unseen cards. Future cards wait until due.
    studyQueue = studyQuestions
      .filter(q => !state[q.id] || Number(state[q.id].dueAt || 0) <= now)
      .sort((a, b) => {
        const aInfo = state[a.id], bInfo = state[b.id];
        const aNew = !aInfo, bNew = !bInfo;
        if (aNew !== bNew) return aNew ? 1 : -1;
        return dueAt(a.id, state) - dueAt(b.id, state);
      });
    studyIndex = 0;
    studyRevealed = false;
    studySessionReviewed = 0;
    $('#search').parentElement.classList.add('hidden');
    $('#count').textContent = 'Study mode';
    renderStudy();
  } catch (e) {
    list.innerHTML = `<div class="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">Could not load study questions: ${esc(e.message)}</div>`;
  }
}
function renderStudy() {
  const stats = reviewStats(studyQuestions);
  const current = studyQueue[studyIndex];
  const progress = studyQueue.length ? Math.min(studyIndex + (studyRevealed ? 1 : 0), studyQueue.length) : 0;
  const top = `<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
    <a href="/" onclick="event.preventDefault(); history.pushState({}, '', '/'); $('#search').parentElement.classList.remove('hidden'); load();" class="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600">← All Questions</a>
    <div class="text-sm text-slate-500 dark:text-slate-400">Session reviewed: <strong>${studySessionReviewed}</strong></div>
  </div>
  <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
    <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"><div class="text-xs text-slate-500">Due now</div><div class="mt-1 text-2xl font-bold">${stats.due}</div></div>
    <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"><div class="text-xs text-slate-500">New</div><div class="mt-1 text-2xl font-bold">${stats.fresh}</div></div>
    <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"><div class="text-xs text-slate-500">Learning</div><div class="mt-1 text-2xl font-bold">${stats.learning}</div></div>
    <div class="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"><div class="text-xs text-slate-500">Mastered (21d+)</div><div class="mt-1 text-2xl font-bold">${stats.mastered}</div></div>
  </div>`;
  if (!studyQuestions.length) {
    list.innerHTML = top + `<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700"><div class="text-4xl">📚</div><h2 class="mt-3 text-xl font-bold">Your question bank is empty</h2><p class="mt-2 text-sm text-slate-500">Add questions first, then come back to practice active recall.</p><button onclick="open()" class="mt-5 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">+ Add Question</button></div>`;
    return;
  }
  if (!current) {
    const nextDue = studyQuestions.map(q => ({ q, info: reviewInfo(q.id) })).filter(x => x.info).sort((a,b) => Number(a.info.dueAt || 0) - Number(b.info.dueAt || 0))[0];
    const wait = nextDue ? humanInterval(Number(nextDue.info.dueAt || 0) - Date.now()) : null;
    list.innerHTML = top + `<div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-900 dark:bg-emerald-950"><div class="text-4xl">🎉</div><h2 class="mt-3 text-2xl font-bold">Session complete!</h2><p class="mt-2 text-slate-600 dark:text-slate-300">You reviewed ${studySessionReviewed} question${studySessionReviewed === 1 ? '' : 's'} in this session.</p><p class="mt-2 text-sm text-slate-500">${wait ? `Next scheduled review: in ${wait}.` : 'Your unseen questions will appear in your next study session.'}</p><div class="mt-6 flex flex-wrap justify-center gap-2"><button onclick="loadStudy()" class="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Refresh queue</button><a href="/" onclick="event.preventDefault(); history.pushState({}, '', '/'); $('#search').parentElement.classList.remove('hidden'); load();" class="rounded-lg bg-slate-700 px-4 py-2 font-semibold text-white">Browse questions</a></div></div>`;
    updateStudyBadge(studyQuestions);
    return;
  }
  const info = reviewInfo(current.id);
  const lastReviewedText = info?.lastReviewed ? `Last reviewed ${new Date(info.lastReviewed).toLocaleString()}` : 'New question · not reviewed yet';
  list.innerHTML = top + `<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2"><span class="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-200">Active Recall · ${studyIndex + 1} / ${studyQueue.length}</span><span class="text-xs text-slate-500">${esc(lastReviewedText)}</span></div>
    <div class="mb-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-full rounded-full bg-fuchsia-600" style="width:${Math.round((progress / studyQueue.length) * 100)}%"></div></div>
    <h2 class="mt-6 text-2xl font-bold leading-relaxed">${esc(current.question)}</h2>
    <div class="my-4 flex flex-wrap gap-2">${(current.tags || []).map(t => `<span class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">${esc(tagName(t))}</span>`).join('')}</div>
    <div class="mt-6 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
      ${studyRevealed ? `<div class="study-answer space-y-5">${(current.answers || []).length ? current.answers.map(a => `<section><h3 class="mb-2 font-bold">${esc(a.title || 'Answer')}</h3><div class="md text-sm leading-7">${md(a.markdown || '')}</div></section>`).join('') : '<p class="text-sm text-slate-500">No answer has been added for this question yet. You can edit the question after this session.</p>'}</div>` : `<div class="py-5 text-center"><div class="text-3xl">🧠</div><h3 class="mt-2 font-bold">Try to answer from memory</h3><p class="mt-1 text-sm text-slate-500">Say your answer aloud or write it down before revealing.</p><button onclick="revealStudyAnswer()" class="mt-5 rounded-lg bg-fuchsia-600 px-5 py-3 font-semibold text-white hover:bg-fuchsia-500">👁️ Reveal answer</button></div>`}
    </div>
    ${studyRevealed ? `<div class="mt-6"><h3 class="mb-2 font-bold">How well did you recall it?</h3><p class="mb-3 text-sm text-slate-500">Choose honestly. The next review date is scheduled from your rating.</p><div class="grid grid-cols-2 gap-2 sm:grid-cols-4"><button onclick="rateStudy('Again')" class="rounded-xl bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-500">Again <span class="block text-xs font-normal">10 min</span></button><button onclick="rateStudy('Hard')" class="rounded-xl bg-amber-600 px-3 py-3 font-semibold text-white hover:bg-amber-500">Hard <span class="block text-xs font-normal">Short interval</span></button><button onclick="rateStudy('Good')" class="rounded-xl bg-emerald-600 px-3 py-3 font-semibold text-white hover:bg-emerald-500">Good <span class="block text-xs font-normal">Normal interval</span></button><button onclick="rateStudy('Easy')" class="rounded-xl bg-blue-600 px-3 py-3 font-semibold text-white hover:bg-blue-500">Easy <span class="block text-xs font-normal">Longer interval</span></button></div></div>` : ''}
    <div class="mt-6 flex flex-wrap justify-between gap-2 border-t border-slate-200 pt-4 dark:border-slate-800"><button onclick="skipStudyQuestion()" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Skip for now</button><button onclick="editQ('${escapeForInline(current.id)}')" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700">Edit question</button></div>
  </article>`;
  highlightCode(list);
}
window.revealStudyAnswer = () => { studyRevealed = true; renderStudy(); };
window.skipStudyQuestion = () => {
  if (!studyQueue.length) return;
  // Skip only for this session. The card remains due and will appear next time.
  studyIndex++;
  studyRevealed = false;
  renderStudy();
};
window.rateStudy = rating => {
  const current = studyQueue[studyIndex];
  if (!current) return;
  const state = readReviewState();
  const old = state[current.id] || { repetitions: 0, intervalDays: 0, ease: 2.5 };
  const reps = Number(old.repetitions || 0);
  const oldInterval = Number(old.intervalDays || 0);
  let intervalDays = oldInterval;
  let ease = Number(old.ease || 2.5);
  let due = Date.now();
  if (rating === 'Again') {
    intervalDays = 0;
    due += 10 * 60 * 1000;
    ease = Math.max(1.3, ease - 0.2);
    state[current.id] = { repetitions: 0, intervalDays, ease, dueAt: due, lastReviewed: Date.now(), lastRating: rating, reviewCount: Number(old.reviewCount || 0) + 1 };
  } else {
    if (rating === 'Hard') {
      intervalDays = reps === 0 ? 1 : Math.max(1, Math.round(oldInterval * 1.2));
      ease = Math.max(1.3, ease - 0.15);
    } else if (rating === 'Good') {
      intervalDays = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(1, Math.round(oldInterval * ease));
    } else {
      intervalDays = reps === 0 ? 3 : reps === 1 ? 5 : Math.max(2, Math.round(oldInterval * (ease + 0.3)));
      ease = Math.min(3.2, ease + 0.15);
    }
    due += intervalDays * 24 * 60 * 60 * 1000;
    state[current.id] = { repetitions: reps + 1, intervalDays, ease, dueAt: due, lastReviewed: Date.now(), lastRating: rating, reviewCount: Number(old.reviewCount || 0) + 1 };
  }
  writeReviewState(state);
  studySessionReviewed++;
  studyIndex++;
  studyRevealed = false;
  updateStudyBadge(studyQuestions);
  renderStudy();
};
$('#studyBtn').onclick = loadStudy;

(async () => { await loadTags(); await load(); })();
