import {gql} from '@apollo/client';

export const REGISTER_USER = gql(`
    mutation RegisterUser($input: SignUpRequest!) {
        userSignUp(input: $input) {
            user {
              email
            }
            token
        }
    }
`);






