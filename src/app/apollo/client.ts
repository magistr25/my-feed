import { ApolloClient, createHttpLink, InMemoryCache, makeVar } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import GET_USER from "@/features/auth/api/queries/getUser.ts";

interface User {
    avatarUrl?: string;
    birthDate?: string;
    country?: string;
    createdAt?: string;
    deletedAt?: string;
    email: string;
    firstName?: string;
    gender?: string;
    id: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    updatedAt?: string;
}

// Создаем ссылку на GraphQL endpoint
const httpLink = createHttpLink({
    uri: 'https://internship-social-media.purrweb.com/graphql',
});

// Middleware для добавления токена в заголовки
const authLink = setContext((_, { headers }) => {
    let token = '';
    try {
        token = localStorage.getItem('authToken') || '';
    } catch (error) {
        console.warn('localStorage недоступен:', error);
    }

    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Настройка Apollo Client
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                user: {
                    read() {
                        return cache.readQuery({ query: GET_USER });
                    },
                },
            },
        },
    },
});

// Локальная переменная для хранения данных пользователя
export const userVar = makeVar<User | null>(
    (() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.warn('Ошибка чтения user из localStorage:', error);
            return null;
        }
    })()
);

// Локальная переменная для хранения состояния "находимся ли в профиле"
export const isInProfileVar = makeVar<boolean>(
    (() => {
        try {
            const storedIsInProfile = localStorage.getItem('isInProfile');
            return storedIsInProfile === 'true';
        } catch (error) {
            console.warn('Ошибка чтения isInProfile из localStorage:', error);
            return false;
        }
    })()
);
// Слушаем изменения `userVar` и сохраняем их в localStorage
userVar.onNextChange((value) => {
    if (value) {
        localStorage.setItem('user', JSON.stringify(value));
    } else {
        localStorage.removeItem('user');
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
});

export default client;



