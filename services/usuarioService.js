import api from './api';

const usuarioService = {
    listar: async () => {
        const response = await api.get('/api/usuario/listar');
        return response.data;
    },
    listarPorId: async (id) => {
        const response = await api.get(`/api/usuario/listarPorId/${id}`);
        return response.data;
    },
    criar: async (data) => {
        const response = await api.post('/api/usuario/criar', data);
        return response.data;
    },
    atualizar: async (id, data) => {
        const response = await api.put(`/api/usuario/atualizar/${id}`, data);
        return response.data;
    },
    deletar: async (id) => {
        await api.delete(`/api/usuario/deletar/${id}`);
    },
    login: async (data) => {
        const response = await api.post('/api/usuario/login', data);
        return response.data;
    }
};

export default usuarioService;
