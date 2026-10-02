function revisionApp(){
return {
topics:[],dark:false,serverStatus:"Connecting...",search:"",category:"All",status:"All",difficulty:"All",sortBy:"default",showOnlyImportant:false,notesOpen:false,selectedTopic:null,
get categories(){return [...new Set(this.topics.map(t=>t.category))]},
get completedCount(){return this.topics.filter(t=>t.done).length},
get importantCount(){return this.topics.filter(t=>t.important).length},
get progress(){return this.topics.length?Math.round(this.completedCount*100/this.topics.length):0},
get filteredTopics(){
const q=this.search.toLowerCase().trim();
let a=this.topics.filter(t=>{
const text=`${t.title} ${t.description} ${t.category} ${t.tags.join(" ")}`.toLowerCase();
return(!q||text.includes(q))&&(this.category==="All"||t.category===this.category)&&
(this.status==="All"||(this.status==="Completed"&&t.done)||(this.status==="Pending"&&!t.done))&&
(this.difficulty==="All"||t.difficulty===this.difficulty)&&(!this.showOnlyImportant||t.important);
});
if(this.sortBy==="title")a.sort((x,y)=>x.title.localeCompare(y.title));
if(this.sortBy==="category")a.sort((x,y)=>x.category.localeCompare(y.category));
if(this.sortBy==="difficulty"){const d={Easy:1,Medium:2,Hard:3};a.sort((x,y)=>d[y.difficulty]-d[x.difficulty])}
return a;
},
async init(){
this.dark=localStorage.getItem("revision-theme")==="dark";
document.documentElement.classList.toggle("dark",this.dark);
await this.load();
},
async load(){
try{const r=await fetch("/api/topics");if(!r.ok)throw new Error();this.topics=await r.json();this.serverStatus="● JSON Connected"}catch(e){this.serverStatus="● Server Error"} 
},
async update(topic,payload){
try{
const r=await fetch(`/api/topics/${topic.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
if(!r.ok)throw new Error();
const updated=await r.json();Object.assign(topic,updated);this.serverStatus="● Saved to JSON";
}catch(e){this.serverStatus="● Save Failed";alert("Could not save data to server.");}
},
saveTheme(){localStorage.setItem("revision-theme",this.dark?"dark":"light");document.documentElement.classList.toggle("dark",this.dark)},
toggleDone(t){this.update(t,{done:!t.done})},
toggleImportant(t){this.update(t,{important:!t.important})},
openNotes(t){this.selectedTopic=t;this.notesOpen=true},
async saveNotes(){await this.update(this.selectedTopic,{notes:this.selectedTopic.notes});this.notesOpen=false},
difficultyClass(x){return{Easy:"bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",Medium:"bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",Hard:"bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}[x]},
async resetProgress(){
if(!confirm("Reset all progress, stars and notes?"))return;
const r=await fetch("/api/reset",{method:"POST"});if(r.ok){this.topics=await r.json();this.serverStatus="● Reset & Saved"}else alert("Reset failed");
}
}}
