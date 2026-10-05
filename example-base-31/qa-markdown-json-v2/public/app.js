const $ = s => document.querySelector(s);
const list = $('#list'); let timer;
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function api(url, options){const r=await fetch(url,{headers:{'Content-Type':'application/json'},...options}); if(!r.ok) throw new Error((await r.json()).error||'Request failed'); return r.status===204?null:r.json()}
function md(text){
  const value = text || '';
  if (window.marked && typeof window.marked.parse === 'function') {
    return window.marked.parse(value);
  }
  if (typeof window.marked === 'function') {
    return window.marked(value);
  }
  return esc(value).replace(/\n/g, '<br>');
}
async function load(){const q=$('#search').value; const data=await api('/api/questions?q='+encodeURIComponent(q)); const questions=Array.isArray(data)?data:(data?.questions||[]); $('#count').textContent=`${questions.length} question${questions.length===1?'':'s'}`; list.innerHTML=questions.length?questions.map(render).join(''):'<div class="empty">No questions found.</div>'}
function render(x){return `<article class="card"><div class="answer-actions"><button class="small" onclick="editQ('${x.id}')">Edit</button><button class="small danger" onclick="deleteQ('${x.id}')">Delete</button></div><h2>${esc(x.question)}</h2><div class="tags">${(x.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>${(x.answers||[]).map(a=>`<div class="answer"><h3>${esc(a.title)}</h3><div class="md">${md(a.markdown)}</div></div>`).join('')}</article>`}
function answerEditor(a={}){const div=document.createElement('div');div.className='answer-editor';div.dataset.id=a.id||'';div.innerHTML=`<div class="answer-editor-head"><input class="atitle" placeholder="Answer title" value="${esc(a.title||'Answer')}"><button type="button" onclick="this.closest('.answer-editor').remove()">Remove</button></div><textarea class="amarkdown" placeholder="Write Markdown here..."></textarea>`;div.querySelector('textarea').value=a.markdown||'';$('#answers').appendChild(div)}
function open(item){$('#modal').classList.remove('hidden');$('#qid').value=item?.id||'';$('#modalTitle').textContent=item?'Edit Question':'New Question';$('#question').value=item?.question||'';$('#tags').value=(item?.tags||[]).join(', ');$('#answers').innerHTML='';(item?.answers?.length?item.answers:[{}]).forEach(answerEditor)}
$('#newBtn').onclick=()=>open();$('#closeBtn').onclick=$('#cancelBtn').onclick=()=>$('#modal').classList.add('hidden');$('#addAnswer').onclick=()=>answerEditor();$('#search').oninput=()=>{clearTimeout(timer);timer=setTimeout(load,200)};
$('#form').onsubmit=async e=>{e.preventDefault();const answers=[...document.querySelectorAll('.answer-editor')].map(x=>({id:x.dataset.id,title:x.querySelector('.atitle').value,markdown:x.querySelector('.amarkdown').value}));const body={question:$('#question').value,tags:$('#tags').value.split(',').map(x=>x.trim()).filter(Boolean),answers};const id=$('#qid').value;await api(id?`/api/questions/${id}`:'/api/questions',{method:id?'PUT':'POST',body:JSON.stringify(body)});$('#modal').classList.add('hidden');load()};
window.editQ=async id=>open(await api('/api/questions/'+id));window.deleteQ=async id=>{if(confirm('Delete this question?')){await api('/api/questions/'+id,{method:'DELETE'});load()}};load();
