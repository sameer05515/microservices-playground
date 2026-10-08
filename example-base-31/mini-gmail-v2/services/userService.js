const fs=require("fs"),path=require("path");
const file=path.join(__dirname,"../data/users.json");
const read=()=>JSON.parse(fs.readFileSync(file,"utf8"));
const save=x=>fs.writeFileSync(file,JSON.stringify(x,null,2));
function findByEmail(email){return read().find(u=>u.email.toLowerCase()===email.toLowerCase())}
function authenticate(email,password){const u=findByEmail(email);return u&&u.password===password?u:null}
function register(name,email,password){
  const users=read();
  if(findByEmail(email))return {error:"Email already registered"};
  const user={id:users.length?Math.max(...users.map(x=>x.id))+1:1,name,email,password};
  users.push(user);save(users);return {user};
}
module.exports={findByEmail,authenticate,register};