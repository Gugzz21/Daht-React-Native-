import axios from 'axios';

const API_URL = 'http://172.20.208.1:8080/api'; 

const api = axios.create({
  baseURL: API_URL,
});



api.interceptors.request.use(async (config) => {
   const token = await AsyncStorage.getItem('@DAHT_TOKEN');
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default api;