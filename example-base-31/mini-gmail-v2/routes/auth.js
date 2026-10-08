const express=require("express"),router=express.Router();
const users=require("../services/userService");
router.get("/login",(req,res)=>res.render("login",{error:null}));
router.post("/login",(req,res)=>{
 const u=users.authenticate(req.body.email,req.body.password);
 if(!u)return res.render("login",{error:"Invalid email or password"});
 req.session.user={id:u.id,name:u.name,email:u.email};res.redirect("/mail/inbox");
});
router.get("/register",(req,res)=>res.render("register",{error:null}));
router.post("/register",(req,res)=>{
 const r=users.register(req.body.name,req.body.email,req.body.password);
 if(r.error)return res.render("register",{error:r.error});
 req.session.user={id:r.user.id,name:r.user.name,email:r.user.email};res.redirect("/mail/inbox");
});
router.get("/logout",(req,res)=>req.session.destroy(()=>res.redirect("/login")));
module.exports=router;