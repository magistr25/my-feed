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
    isLiked: boolean;
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
    isLiked: boolean;
}

export interface FullPostData {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isLiked: boolean;
    likesCount: number;
    authorId: string;
    author: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
        birthDate: string | null;
        country: string | null;
        email: string;
        gender: string | null;
        middleName: string | null;
        phone: string | null;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
}
export interface PostProps {
    id: string;
    title: string;
    description: string;
    mediaUrl: string;
    createdAt: string;
    author: {
        avatarUrl: string | null;
        firstName: string;
        lastName: string;
    };
    isLiked: boolean;
}
