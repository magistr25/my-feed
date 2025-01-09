import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://internship-social-media.purrweb.com/graphql',
    cache: new InMemoryCache(),
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` || '',
    },
});

export default client;
