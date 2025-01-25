export interface Author {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

export interface Post {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    createdAt: string;
    author: Author;
}

export interface PageInfo {
    afterCursor: string | null;
    count: number;
    perPage: number;
}

export interface PostData {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    createdAt: string;
    author: Author;
}
