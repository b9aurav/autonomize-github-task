import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<any> => {
    const { username } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            res.status(200).json(existingUser);
            return;
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);
        const userData = response.data;

        const newUser = await prisma.user.create({
            data: {
                username: userData.login,
                name: userData.name,
                avatarUrl: userData.avatar_url,
                location: userData.location,
                bio: userData.bio,
                blog: userData.blog,
                publicRepos: userData.public_repos,
                publicGists: userData.public_gists,
                followers: userData.followers,
                following: userData.following,
                createdAt: userData.created_at,
            },
        });

        return res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { location, blog, bio } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { username },
            data: { location, blog, bio },
        });
        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const deletedUser = await prisma.user.update({
            where: { username },
            data: { softDeleted: true },
        });
        res.status(200).json(deletedUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    const { username, location, name } = req.query;
    try {
        const filters: any = {
            softDeleted: false,
        };

        if (username) {
            filters.username = { contains: username as string, mode: 'insensitive' };
        }

        if (location) {
            filters.location = { contains: location as string, mode: 'insensitive' };
        }

        if (name) {
            filters.name = { contains: name as string, mode: 'insensitive' };
        }

        const users = await prisma.user.findMany({
            where: filters,
        });

        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSortedUsers = async (req: Request, res: Response) => {
    const { sortBy, order = 'asc' } = req.query;
    const validSortFields = ['publicRepos', 'publicGists', 'followers', 'following', 'createdAt'];

    if (!sortBy || !validSortFields.includes(sortBy as string)) {
        res.status(400).json({ error: 'Invalid sort field' });
        return;
    }

    try {
        const users = await prisma.user.findMany({
            where: { softDeleted: false },
            orderBy: {
                [sortBy as string]: order as 'asc' | 'desc',
            },
        });
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};