export interface User {
    id: number;
    username: string;
    name?: string;
    avatarUrl?: string;
    location?: string;
    bio?: string;
    blog?: string;
    publicRepos: number;
    publicGists: number;
    followers: number;
    following: number;
    createdAt: Date;
    softDeleted: boolean;
    friends?: Friend[];
    friendsWith?: Friend[];
    repositories?: Repository[];
  }
  
  export interface Repository {
    id: number;
    name: string;
    description?: string;
    url: string;
    forkCount: number;
    homepageUrl?: string;
    stargazers_count: number;
    createdAt: Date;
    userId: number;
    user?: User;
  }
  
  export interface Friend {
    id: number;
    userId: number;
    friendId: number;
    user?: User;
    friend?: User;
  }