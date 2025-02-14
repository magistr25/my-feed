import { gql } from "@apollo/client";

export const GET_MY_POSTS = gql`
    query MyPosts($input: FindMyPostsRequest!) {
        myPosts(input: $input) {
            data {
                id
                title
                description
                mediaUrl
                createdAt
                isLiked
                likesCount
                author {
                    id
                    firstName
                    lastName
                    avatarUrl
                }
            }
            pageInfo {
                afterCursor
                count
                perPage
            }
        }
    }
`;
