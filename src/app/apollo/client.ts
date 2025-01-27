import { ApolloClient, createHttpLink,InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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
const client = new ApolloClient({
    link: authLink.concat(httpLink), // Объединяем authLink и httpLink
    cache: new InMemoryCache(),
});

export default client;


