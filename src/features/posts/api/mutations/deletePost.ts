import { gql } from "@apollo/client";

export const DELETE_POST = gql`
    mutation postDelete($input: PostIdRequest!) {
        postDelete(input: $input) {
            id
            ok
        }
    }
`;
