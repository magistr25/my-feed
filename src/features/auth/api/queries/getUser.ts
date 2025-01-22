import { gql } from '@apollo/client';

const GET_USER = gql(`
    query GetUser {
        user @client
    }
`);
export default GET_USER
