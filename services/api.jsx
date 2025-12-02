import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// IP da sua rede Senac
const API_URL = 'http://192.168.0.35:8412/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// INTERCEPTOR MÁGICO: 
// Antes de qualquer requisição, ele pega o token e cola no cabeçalho.
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log("Erro ao pegar token", error);
  }
  return config;
});

export default api;