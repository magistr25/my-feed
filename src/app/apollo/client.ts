import { ApolloClient, InMemoryCache } from '@apollo/client';

let token = '';
try {
    token = localStorage.getItem('token') || '';
} catch (error) {
    console.warn('localStorage недоступен:', error);
}

const client = new ApolloClient({
    uri: 'https://internship-social-media.purrweb.com/graphql',
    cache: new InMemoryCache(),
    headers: {
        Authorization: token ? `Bearer ${token}` : '',
    },
});

export default client;

