import axios, { AxiosError } from 'axios';
import { User } from './interfaces';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleApiError = (error: AxiosError) => {
    if (error.response?.status === 500) {
        alert('The GitHub API rate limit has been exceeded. You can still retrieve the saved data from the database. Please try fetching the data again later.');
        throw new Error('GitHub API rate limit exceeded');
    }
    throw error;
};

export const fetchUser = async (username: string): Promise<User> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${username}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleApiError(error);
        }
        throw error;
    }
};

export const fetchRepositories = async (username: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${username}/repos`);
        if (response.data.repositories) return response.data.repositories;
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleApiError(error);
        }
        throw error;
    }
};

export const fetchFriends = async (username: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${username}/friends`);
        if (response.data.friends[0]?.friend) {
            return response.data.friends.map((item: { friend: User }) => item.friend);
        }
        return response.data.friends;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleApiError(error);
        }
        throw error;
    }
};

export const fetchConnections = async (username: string, connection: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/${username}/connections?type=${connection}`);
        if (response.data.follower) return response.data.follower;
        return response.data.following;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleApiError(error);
        }
        throw error;
    }
};