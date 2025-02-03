import { gql } from '@apollo/client';

export const POST_LIKE = gql(`
    mutation PostLike($input: PostIdRequest!) {
        postLike(input: $input) {
            id
            isLiked
            likesCount
        }
    }
`);
