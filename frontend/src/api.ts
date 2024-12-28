import axios from 'axios';
import { User } from './interfaces';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUser = async (username: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${username}`);
    return response.data;
};

export const fetchRepositories = async (username: string) => {
    const response = await axios.get(`${API_BASE_URL}/users/${username}/repos`);
    if (response.data.repositories) return response.data.repositories;
    return response.data;
};

export const fetchFriends = async (username: string) => {
    const response = await axios.post(`${API_BASE_URL}/users/${username}/friends`);
    if (response.data.friends[0].friend) return response.data.friends.map((item: { friend: User }) => item.friend);
    return response.data.friends;
};