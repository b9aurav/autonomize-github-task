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

export const findAndSaveFriends = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const existingFriends = await prisma.friend.findMany({
            where: { userId: user.id },
            include: { friend: true }
        });

        if (existingFriends.length > 0) {
            res.status(200).json({ friends: existingFriends });
            return;
        }

        const [followersResponse, followingResponse] = await Promise.all([
            axios.get(`https://api.github.com/users/${username}/followers`),
            axios.get(`https://api.github.com/users/${username}/following`)
        ]);

        const followers = followersResponse.data.map((user: any) => user.login);
        const following = followingResponse.data.map((user: any) => user.login);

        const mutualFriends = followers.filter((user: string) => following.includes(user));

        const friends = [];
        for (const friendUsername of mutualFriends) {
            let friend = await prisma.user.findUnique({ where: { username: friendUsername } });
            if (!friend) {
                const friendResponse = await axios.get(`https://api.github.com/users/${friendUsername}`);
                const friendData = friendResponse.data;

                friend = await prisma.user.create({
                    data: {
                        username: friendData.login,
                        name: friendData.name,
                        avatarUrl: friendData.avatar_url,
                        location: friendData.location,
                        bio: friendData.bio,
                        blog: friendData.blog,
                        publicRepos: friendData.public_repos,
                        publicGists: friendData.public_gists,
                        followers: friendData.followers,
                        following: friendData.following,
                        createdAt: new Date(friendData.created_at),
                    },
                });
            }
            friends.push(friend);
        }

        const friendRelations = friends.map(friend => ({
            userId: user.id,
            friendId: friend.id
        }));

        await prisma.friend.createMany({
            data: friendRelations,
            skipDuplicates: true
        });

        res.status(200).json({ message: 'Mutual friends saved successfully', friends });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};