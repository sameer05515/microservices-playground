const fs=require("fs"),path=require("path");
const file=path.join(__dirname,"../data/emails.json");
const read=()=>JSON.parse(fs.readFileSync(file,"utf8"));
const save=x=>fs.writeFileSync(file,JSON.stringify(x,null,2));
const sort=x=>x.sort((a,b)=>new Date(b.date)-new Date(a.date));
function visible(e,u){return !e.deleted && (e.from===u||e.to===u)}
function inbox(u){return sort(read().filter(e=>!e.deleted&&e.to===u))}
function sent(u){return sort(read().filter(e=>!e.deleted&&e.from===u))}
function starred(u){return sort(read().filter(e=>visible(e,u)&&e.starred))}
function trash(u){return sort(read().filter(e=>e.deleted&&(e.from===u||e.to===u)))}
function drafts(u){return sort(read().filter(e=>e.draft&&e.from===u))}
function find(id){return read().find(e=>e.id===Number(id))}
function create(data){
 const a=read(),id=a.length?Math.max(...a.map(e=>e.id))+1:1;
 const e={id,date:new Date().toISOString(),read:false,starred:false,deleted:false,draft:false,...data};
 a.push(e);save(a);return e;
}
function update(id,data){
 const a=read(),e=a.find(x=>x.id===Number(id));if(!e)return null;
 Object.assign(e,data);save(a);return e;
}
function markRead(id,u){const e=find(id);if(e&&(e.to===u||e.from===u)){e.read=true;save(read());return e}}
function toggleStar(id,u){const a=read(),e=a.find(x=>x.id===Number(id));if(!e||!visible(e,u))return null;e.starred=!e.starred;save(a);return e}
function moveTrash(id,u){const a=read(),e=a.find(x=>x.id===Number(id));if(e&&(e.from===u||e.to===u)){e.deleted=true;save(a)}}
function restore(id,u){const a=read(),e=a.find(x=>x.id===Number(id));if(e&&(e.from===u||e.to===u)){e.deleted=false;save(a)}}
function permanentDelete(id,u){const a=read().filter(e=>!(e.id===Number(id)&&e.deleted&&(e.from===u||e.to===u)));save(a)}
function search(u,q){q=q.toLowerCase();return sort(read().filter(e=>visible(e,u)&&[e.from,e.to,e.subject,e.body].some(v=>(v||"").toLowerCase().includes(q))))}
function countUnread(u){return inbox(u).filter(e=>!e.read).length}
module.exports={inbox,sent,starred,trash,drafts,find,create,update,markRead,toggleStar,moveTrash,restore,permanentDelete,search,countUnread};