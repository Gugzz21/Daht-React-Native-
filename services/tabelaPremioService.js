import api from './api';

const tabelaPremioService = {
    listar: async () => {
        const response = await api.get('/api/tabelapremio/listar');
        return response.data;
    },
    listarPorId: async (id) => {
        const response = await api.get(`/api/tabelapremio/listarPorId/${id}`);
        return response.data;
    },
    criar: async (data) => {
        const response = await api.post('/api/tabelapremio/criar', data);
        return response.data;
    },
    deletar: async (id) => {
        await api.delete(`/api/tabelapremio/deletar/${id}`);
    }
};

export default tabelaPremioService;
