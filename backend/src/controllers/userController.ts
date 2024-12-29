import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const fetchAndSaveGithubUser = async (username: string): Promise<any> => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return existingUser;
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);
        if (response.status !== 200) {
            throw new Error(`Failed to fetch GitHub user: ${response.statusText}`);
        }
        const userData = response.data;

        return await prisma.user.create({
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
                createdAt: new Date(userData.created_at),
            },
        });
    } catch (error: any) {
        throw new Error(`Failed to fetch and save GitHub user: ${error.message}`);
    }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
    const { username } = req.body;
    try {
        const user = await fetchAndSaveGithubUser(username);
        return res.status(201).json(user);
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
            req.body.username = username;
            createUser(req, res);
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

const saveUserRelationships = async (
    userId: number,
    relatedUsers: string[],
    relationType: 'follower' | 'following'
): Promise<any[]> => {
    try {
        const relationships = await Promise.all(
            relatedUsers.map(async (username) => {
                const relatedUser = await fetchAndSaveGithubUser(username);
                await prisma.userRelationship.create({
                    data: {
                        userId,
                        relatedUserId: relatedUser.id,
                        type: relationType,
                    },
                });
                return relatedUser;
            })
        );
        return relationships;
    } catch (error: any) {
        throw new Error(`Failed to save user relationships: ${error.message}`);
    }
};

export const fetchAndSaveUserConnections = async (req: Request, res: Response) => {
    const { username } = req.params;
    const { type } = req.query as { type: 'follower' | 'following' };
    
    try {
        const user = await fetchAndSaveGithubUser(username);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const existingRelationships = await prisma.userRelationship.findMany({
            where: { userId: user.id, type },
            include: { relatedUser: true }
        });

        if (existingRelationships.length > 0) {
            res.status(200).json({ 
                [type as string]: existingRelationships.map(rel => rel.relatedUser) 
            });
            return;
        }

        const response = await axios.get(`https://api.github.com/users/${username}/${type}`);
        const connections = response.data.map((user: any) => user.login);
        
        const savedConnections = await saveUserRelationships(user.id, connections, type);
        res.status(200).json({ [type as string]: savedConnections });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const findAndSaveFriends = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await fetchAndSaveGithubUser(username);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const existingFriends = await prisma.friend.findMany({
            where: { userId: user.id },
            include: { friend: true }
        });

        if (existingFriends.length > 0) {
            res.status(200).json({ friends: existingFriends.map(f => f.friend) });
            return;
        }

        const [followersResponse, followingResponse] = await Promise.all([
            axios.get(`https://api.github.com/users/${username}/followers`),
            axios.get(`https://api.github.com/users/${username}/following`)
        ]);

        const followers = followersResponse.data.map((user: any) => user.login);
        const following = followingResponse.data.map((user: any) => user.login);
        const mutualFriends = followers.filter((user: string) => following.includes(user));

        const friends = await Promise.all(
            mutualFriends.map((friendUsername: string) => fetchAndSaveGithubUser(friendUsername))
        );

        await prisma.friend.createMany({
            data: friends.map(friend => ({
                userId: user.id,
                friendId: friend.id
            })),
            skipDuplicates: true
        });

        res.status(200).json({ message: 'Mutual friends saved successfully', friends });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const fetchRepositories = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        const repositories = response.data;

        const repositoryData = repositories.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stargazers_count: repo.stargazers_count,
            forkCount: repo.forks_count,
            homepageUrl: repo.homepage,
            createdAt: repo.created_at,
            userId: user.id
        }));

        await prisma.repository.createMany({
            data: repositoryData,
            skipDuplicates: true
        });

        res.status(200).json({ message: 'Repositories saved successfully', repositories: repositoryData });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getRepositories = async (req: Request, res: Response) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const repositories = await prisma.repository.findMany({
            where: { userId: user.id }
        });

        if (repositories.length === 0) {
            fetchRepositories(req, res);
            return;
        }

        res.status(200).json(repositories);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}