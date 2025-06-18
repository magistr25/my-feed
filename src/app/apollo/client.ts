import {ApolloClient, createHttpLink, from, InMemoryCache, makeVar} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

import GET_USER from "@/features/auth/api/queries/getUser.ts";
import {UserProfileData} from "@/pages/model/types/UserProfileData.ts";


export interface User {
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
// Обработчик ошибок Apollo
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });

        // Если возникает ошибка авторизации, можно перенаправить пользователя
        const authError = graphQLErrors.find((error) => error.extensions?.code === 'UNAUTHENTICATED');
        if (authError) {
            localStorage.removeItem('authToken');
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        // Если сеть недоступна, перенаправляем на страницу ошибки
        window.location.href = '/error-500';
    }
});
// Создаем ссылку на GraphQL endpoint
const httpLink = createHttpLink({
    uri: 'https://internship-social-media.purrweb.net/graphql',
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
export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                posts: {
                    keyArgs: false, // Отключаем дефолтное поведение Apollo по ключам
                    merge(existing = [], incoming) {
                        return [...existing, ...incoming];
                    },
                },
                user: {
                    read() {
                        return cache.readQuery({ query: GET_USER });
                    },
                },
            },
        },
        Post: {
            keyFields: ["id"], // Указываем, что уникальный идентификатор для Post — это id
        },
    },
});
// Глобальная переменная для хранения состояния загрузки
export const loadingStateVar = makeVar(false);

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
    }
});

// Переменная для хранения состояния лайков
export const likeVar = makeVar<Record<string, boolean>>({});

// Переменная состояния мобильного меню
export const mobileMenuVar = makeVar<boolean>(false);

// Глобальная переменная для состояния MobileActionBar
export const mobileActionBarVar = makeVar<boolean>(false);
// export const scrollVar = makeVar<number | null>(null);

export const profileVar = makeVar<UserProfileData | null>(null);

// Глобальная переменная для управления видимостью MobileActionBar
export const showActionBarVar = makeVar<boolean>(false);

// Глобальная переменная для хранения аватарки
export const avatarFileVar = makeVar<File | null>(null);
export const avatarUrlVar = makeVar<string | null>(null);

// Переменные для поста пользователя
export const imageVar = makeVar<File | null>(null);
export const titleVar = makeVar<string>("");
export const descriptionVar = makeVar<string>("");
export const previewVar = makeVar<string | null>(null);

// Переменные для загрузки изображения поста
export const postFileVar = makeVar<File | null>(null);
export const postUrlVar = makeVar<string | null>(null);

export const notificationVar = makeVar<{ message: string; type: "success" | "error" } | null>(null);

const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
});

export default client;



