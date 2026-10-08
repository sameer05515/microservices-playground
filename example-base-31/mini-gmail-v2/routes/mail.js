const express=require("express"),router=express.Router();
const auth=require("../middleware/auth"),mail=require("../services/emailService");
router.use(auth);

function common(req){return {unread:mail.countUnread(req.session.user.email)}}
function page(req,res,title,emails,extra={}){res.render("mailbox",{title,emails,page:title.toLowerCase(),...common(req),...extra})}

router.get("/inbox",(req,res)=>page(req,res,"Inbox",mail.inbox(req.session.user.email)));
router.get("/sent",(req,res)=>page(req,res,"Sent",mail.sent(req.session.user.email)));
router.get("/starred",(req,res)=>page(req,res,"Starred",mail.starred(req.session.user.email)));
router.get("/trash",(req,res)=>page(req,res,"Trash",mail.trash(req.session.user.email)));
router.get("/drafts",(req,res)=>page(req,res,"Drafts",mail.drafts(req.session.user.email)));

router.get("/compose",(req,res)=>res.render("compose",{email:null,error:null}));
router.post("/send",(req,res)=>{
 const {to,subject,body,id}=req.body;
 if(!to||!subject||!body)return res.render("compose",{email:req.body,error:"To, subject and message are required"});
 if(id)mail.update(id,{to,subject,body,draft:false,read:false});
 else mail.create({from:req.session.user.email,to,subject,body});
 res.redirect("/mail/sent");
});
router.post("/draft",(req,res)=>{
 const {to="",subject="",body="",id}=req.body;
 if(id)mail.update(id,{to,subject,body,draft:true});
 else mail.create({from:req.session.user.email,to,subject,body,draft:true});
 res.redirect("/mail/drafts");
});

router.get("/view/:id",(req,res)=>{
 const e=mail.find(req.params.id);
 if(!e||(e.from!==req.session.user.email&&e.to!==req.session.user.email))return res.status(404).send("Email not found");
 if(!e.draft)mail.markRead(e.id,req.session.user.email);
 res.render("email",{email:e});
});
router.get("/reply/:id",(req,res)=>{
 const e=mail.find(req.params.id);if(!e)return res.status(404).send("Email not found");
 res.render("compose",{email:{to:e.from,subject:e.subject.startsWith("Re:")?e.subject:"Re: "+e.subject,body:"\n\n--- Original message ---\n"+e.body},error:null});
});
router.get("/forward/:id",(req,res)=>{
 const e=mail.find(req.params.id);if(!e)return res.status(404).send("Email not found");
 res.render("compose",{email:{to:"",subject:e.subject.startsWith("Fwd:")?e.subject:"Fwd: "+e.subject,body:"\n\n--- Forwarded message ---\nFrom: "+e.from+"\n\n"+e.body},error:null});
});
router.post("/star/:id",(req,res)=>{mail.toggleStar(req.params.id,req.session.user.email);res.redirect(req.get("Referer")||"/mail/inbox")});
router.post("/trash/:id",(req,res)=>{mail.moveTrash(req.params.id,req.session.user.email);res.redirect(req.get("Referer")||"/mail/inbox")});
router.post("/restore/:id",(req,res)=>{mail.restore(req.params.id,req.session.user.email);res.redirect("/mail/trash")});
router.post("/delete/:id",(req,res)=>{mail.permanentDelete(req.params.id,req.session.user.email);res.redirect("/mail/trash")});
router.get("/search",(req,res)=>page(req,res,"Search",mail.search(req.session.user.email,req.query.q||""),{search:req.query.q||""}));
module.exports=router;