import { gql } from "@apollo/client";

export const CREATE_POST = gql(`
    mutation CreatePost($input: CreatePostRequest!) {
        postCreate(input: $input) {
            id
            title
            description
            mediaUrl
        }
    }
`);



