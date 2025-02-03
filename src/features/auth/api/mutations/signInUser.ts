import { gql } from '@apollo/client';

export const SIGN_IN_USER = gql(`
    mutation SignIn($input: SignInRequest!) {
        userSignIn(input: $input) {
            token
            user {
                id
                email
                firstName
                lastName
                avatarUrl
                birthDate
                country
                createdAt
                deletedAt
                gender
                middleName
                phone
                updatedAt
            }
            problem {
                message
            }
        }
    }
`);
