import api from './api';

const missaoService = {
    listar: async () => {
        const response = await api.get('/api/missao/listar');
        return response.data;
    },
    listarPorId: async (id) => {
        const response = await api.get(`/api/missao/listarPorId/${id}`);
        return response.data;
    },
    criar: async (data) => {
        const response = await api.post('/api/missao/criar', data);
        return response.data;
    },
    atualizar: async (id, data) => {
        const response = await api.put(`/api/missao/atualizar/${id}`, data);
        return response.data;
    },
    deletar: async (id) => {
        await api.delete(`/api/missao/deletar/${id}`);
    }
};

export default missaoService;
