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

(async () => { await loadTags(); await load(); })();
