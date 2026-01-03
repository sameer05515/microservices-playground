import axios from 'axios';
const api=axios.create({baseURL:'http://localhost:8080/api'});
let refreshing=null;
api.interceptors.request.use(c=>{const t=localStorage.getItem('accessToken');if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
api.interceptors.response.use(r=>r,async e=>{
 const original=e.config;
 if(e.response?.status===401 && !original._retry && localStorage.getItem('refreshToken')){
   original._retry=true;
   try{
     refreshing ??= api.post('/auth/refresh',{},{params:{token:localStorage.getItem('refreshToken')}}).finally(()=>refreshing=null);
     const r=await refreshing; localStorage.setItem('accessToken',r.data.accessToken);localStorage.setItem('refreshToken',r.data.refreshToken);
     original.headers.Authorization=`Bearer ${r.data.accessToken}`; return api(original);
   }catch(x){localStorage.clear();window.dispatchEvent(new Event('auth-expired'));return Promise.reject(x);}
 }
 return Promise.reject(e);
});
export default api;
