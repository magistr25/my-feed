import {gql} from '@apollo/client';

export const GET_FULL_POST_QUERY = gql`
    query GetFullPost($input: PostIdRequest!) {
        post(input: $input) {
            id
            title
            description
            mediaUrl
            createdAt
            updatedAt
            deletedAt
            isLiked
            likesCount
            authorId
            author {
                id
                firstName
                lastName
                avatarUrl
                birthDate
                country
                email
                gender
                middleName
                phone
                createdAt
                updatedAt
                deletedAt
            }
        }
    }
`;
