import api from './api';

const ganhoService = {
    listar: async () => {
        const response = await api.get('/api/ganho/listar');
        return response.data;
    },
    listarPorId: async (id) => {
        const response = await api.get(`/api/ganho/listarPorId/${id}`);
        return response.data;
    },
    criar: async (data) => {
        const response = await api.post('/api/ganho/criar', data);
        return response.data;
    },
    atualizar: async (id, data) => {
        const response = await api.put(`/api/ganho/atualizar/${id}`, data);
        return response.data;
    },
    deletar: async (id) => {
        await api.delete(`/api/ganho/deletar/${id}`);
    }
};

export default ganhoService;
