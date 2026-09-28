import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',

    headers: {
        Accept: 'application/json',
    },
});


/*
|--------------------------------------------------------------------------
| Ajouter automatiquement le token d'authentification
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
|--------------------------------------------------------------------------
| Gestion globale des erreurs 401
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            // Supprimer le token expiré/invalide
            localStorage.removeItem('token');

            // Optionnel :
            // window.location.href = '/connexion';
        }

        return Promise.reject(error);
    }
);


export default api;

