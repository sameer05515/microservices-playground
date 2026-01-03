import api from './api';export const login=async x=>(await api.post('/auth/login',x)).data;export const register=async x=>(await api.post('/auth/register',x)).data;
