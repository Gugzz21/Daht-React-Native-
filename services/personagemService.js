import api from './api';

const personagemService = {
    listar: async () => {
        const response = await api.get('/api/personagem/listar');
        return response.data;
    },
    listarPorId: async (id) => {
        const response = await api.get(`/api/personagem/listarPorId/${id}`);
        return response.data;
    },
    criar: async (data) => {
        const response = await api.post('/api/personagem/criar', data);
        return response.data;
    },
    atualizar: async (id, data) => {
        const response = await api.put(`/api/personagem/atualizar/${id}`, data);
        return response.data;
    },
    deletar: async (id) => {
        await api.delete(`/api/personagem/deletar/${id}`);
    }
};

export default personagemService;
