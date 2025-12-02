  import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

  // IP da sua rede Senac
// Este é o seu servidor, onde você tem controle e deve configurar o CORS
const API_URL = 'http://10.12.10.13:8412/api';// Exemplo, o '/api' pode mudar.

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