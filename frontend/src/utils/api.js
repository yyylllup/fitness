
// import axios from 'axios'

// const instance = axios.create({
//   baseURL: '/api',
//   timeout: 5000
// })

// instance.interceptors.request.use(config => {
//   config.headers.Authorization = localStorage.getItem('token') || ''
//   return config
// })

// export const getRecordsAPI = () => instance.get('/records')
// export const loginAPI = data => instance.post('/login', data)
// export const getProfileAPI = () => instance.get('/user/profile')
// export const updateProfileAPI = data => instance.put('/user/profile', data)
// export const getChartData = () => instance.get('/stats/weekly')

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
  withCredentials: true       // 如果后端改用 cookie 就打开
})

api.interceptors.request.use(cfg=>{
  const token = localStorage.getItem('jwt');
  if(token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
})

export default api

