import api from './api';

const premioService = {
    listar: async () => {
        const response = await api.get('/api/premio/listar');
        return response.data;
    },
    listarPorId: async (id) => {
        const response = await api.get(`/api/premio/listarPorId/${id}`);
        return response.data;
    },
    criar: async (data) => {
        const response = await api.post('/api/premio/criar', data);
        return response.data;
    },
    atualizar: async (id, data) => {
        const response = await api.put(`/api/premio/atualizar/${id}`, data);
        return response.data;
    },
    deletar: async (id) => {
        await api.delete(`/api/premio/deletar/${id}`);
    }
};

export default premioService;
