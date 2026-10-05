const $ = s => document.querySelector(s);
const list = $('#list');
let timer;

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
  if (window.marked && typeof window.marked.parse === 'function') return window.marked.parse(value);
  return esc(value).replace(/\n/g, '<br>');
}
async function load() {
  const data = await api('/api/questions?q=' + encodeURIComponent($('#search').value));
  const questions = Array.isArray(data) ? data : (data?.questions || []);
  $('#count').textContent = `${questions.length} question${questions.length === 1 ? '' : 's'}`;
  list.innerHTML = questions.length ? questions.map(render).join('') : '<div class="py-16 text-center text-slate-500">No questions found.</div>';
}
function render(x) {
  return `<article class="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="mb-3 flex justify-end gap-2"><button class="rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-500" onclick="editQ('${x.id}')">Edit</button><button class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500" onclick="deleteQ('${x.id}')">Delete</button></div>
    <h2 class="text-xl font-bold">${esc(x.question)}</h2>
    <div class="my-3 flex flex-wrap gap-2">${(x.tags||[]).map(t=>`<span class="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">${esc(t)}</span>`).join('')}</div>
    ${(x.answers||[]).map(a=>`<div class="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800"><h3 class="mb-2 font-semibold">${esc(a.title)}</h3><div class="md text-sm leading-7">${md(a.markdown)}</div></div>`).join('')}
  </article>`;
}
function answerEditor(a = {}) {
  const div = document.createElement('div');
  div.className = 'my-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950';
  div.dataset.id = a.id || '';
  div.innerHTML = `<div class="flex gap-2"><input class="atitle min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Answer title" value="${esc(a.title || 'Answer')}"><button type="button" class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" onclick="this.closest('.answer-editor').remove()">Remove</button></div><textarea class="amarkdown mt-3 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-900" placeholder="Write Markdown here..."></textarea>`;
  div.querySelector('textarea').value = a.markdown || '';
  $('#answers').appendChild(div);
}
function open(item) {
  $('#modal').classList.remove('hidden');
  $('#modal').classList.add('flex');
  $('#qid').value = item?.id || '';
  $('#modalTitle').textContent = item ? 'Edit Question' : 'New Question';
  $('#question').value = item?.question || '';
  $('#tags').value = (item?.tags || []).join(', ');
  $('#answers').innerHTML = '';
  (item?.answers?.length ? item.answers : [{}]).forEach(answerEditor);
}
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').classList.remove('flex'); }
$('#newBtn').onclick = () => open();
$('#closeBtn').onclick = closeModal;
$('#cancelBtn').onclick = closeModal;
$('#addAnswer').onclick = () => answerEditor();
$('#search').oninput = () => { clearTimeout(timer); timer = setTimeout(load, 200); };
$('#form').onsubmit = async e => {
  e.preventDefault();
  const answers = [...document.querySelectorAll('.answer-editor')].map(x => ({id:x.dataset.id,title:x.querySelector('.atitle').value,markdown:x.querySelector('.amarkdown').value}));
  const body = {question:$('#question').value,tags:$('#tags').value.split(',').map(x=>x.trim()).filter(Boolean),answers};
  const id = $('#qid').value;
  await api(id ? `/api/questions/${id}` : '/api/questions', {method:id ? 'PUT' : 'POST', body:JSON.stringify(body)});
  closeModal();
  load();
};
window.editQ = async id => open(await api('/api/questions/' + id));
window.deleteQ = async id => { if (confirm('Delete this question?')) { await api('/api/questions/' + id, {method:'DELETE'}); load(); } };
load();
