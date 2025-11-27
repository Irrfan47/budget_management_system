import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const user = sessionStorage.getItem('user');
        if (user) {
            const token = JSON.parse(user).token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        sessionStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    updateProfile: async (userData: any) => {
        const response = await api.put('/auth/profile', userData);
        if (response.data.token) {
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    updateProfilePhoto: async (formData: FormData) => {
        const response = await api.put('/auth/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export const userService = {
    getUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    createUser: async (userData: any) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    updateUser: async (id: string, userData: any) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export const programService = {
    getPrograms: async (userId?: string) => {
        const params = userId ? { userId } : {};
        const response = await api.get('/programs', { params });
        return response.data;
    },
    createProgram: async (programData: FormData) => {
        const response = await api.post('/programs', programData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateProgram: async (id: string, programData: FormData) => {
        const response = await api.put(`/programs/${id}`, programData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deleteDocument: async (programId: string, documentId: string) => {
        const response = await api.delete(`/programs/${programId}/documents/${documentId}`);
        return response.data;
    },
    deleteProgram: async (id: string) => {
        const response = await api.delete(`/programs/${id}`);
        return response.data;
    }
};

export default api;
