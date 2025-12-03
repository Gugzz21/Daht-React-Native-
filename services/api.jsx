import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ✅ A URL CERTA (Apontando para a base da API, sem o /v3/api-docs)
const API_URL = 'http://academico3.rj.senac.br/daht';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');

    // ADICIONE ESTE LOG:
    console.log("🔑 Token sendo enviado:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log("Erro ao pegar token", error);
  }
  return config;
});

export default api;