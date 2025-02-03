import { gql } from '@apollo/client';

export const POST_UNLIKE = gql(`
    mutation PostUnlike($input: PostIdRequest!) {
        postUnlike(input: $input) {
            id
            isLiked
            likesCount
        }
    }
`);
