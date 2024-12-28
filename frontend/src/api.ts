import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUser = async (username: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${username}`);
    return response.data;
};

export const fetchRepositories = async (username: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${username}/repositories`);
    return response.data;
};

export const fetchFollowers = async (username: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${username}/followers`);
    return response.data;
};