import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router'; // Importe o router

const API_URL = 'http://academico3.rj.senac.br/daht';

const api = axios.create({
  baseURL: API_URL,
});

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

// --- NOVO: Interceptor de Resposta ---
api.interceptors.response.use(
  (response) => response, // Se der tudo certo, apenas retorna
  async (error) => {
    // Se o erro for 403 (Proibido) ou 401 (Não Autorizado)
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      console.log("Sessão expirada ou inválida. Deslogando...");
      
      // 1. Limpa o token inválido
      await AsyncStorage.clear();
      
      // 2. Manda o usuário para o Login
      // Nota: O router.replace pode não funcionar perfeitamente dentro do axios dependendo da versão,
      // mas é uma tentativa válida. Caso contrário, o usuário terá que reiniciar o app.
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export default api;