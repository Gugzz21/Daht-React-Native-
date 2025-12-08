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
      console.log("Interceptor: Token adicionado ao header");
    } else {
      console.log("Interceptor: Nenhum token encontrado no storage");
    }
  } catch (error) {
    console.log("Erro ao pegar token no interceptor", error);
  }
  return config;
});

// --- NOVO: Interceptor de Resposta ---
api.interceptors.response.use(
  (response) => response, // Se der tudo certo, apenas retorna
  async (error) => {
    // Se o erro for 403 (Proibido) ou 401 (Não Autorizado)
    if (error.response) {
      console.log(`Erro API: Status ${error.response.status} - URL: ${error.config.url}`);
      console.log("Dados do erro:", error.response.data);

      if (error.response.status === 403 || error.response.status === 401) {
        console.log("Sessão expirada ou inválida. Deslogando...");
        await AsyncStorage.clear();
        router.replace('/(auth)/login');
      }
    } else if (error.request) {
      console.log("Erro API: Sem resposta do servidor", error.request);
    } else {
      console.log("Erro API: Falha na configuração da requisição", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;