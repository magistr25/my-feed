import { gql } from "@apollo/client";

const EDIT_USER_PROFILE = gql`
    mutation EditUserProfile($input: EditProfileRequest!) {
        userEditProfile(input: $input) {
            problem {
                __typename
                ... on EmailAlreadyUsedProblem {
                    message
                }
                ... on PhoneAlreadyUsedProblem {
                    message
                }
            }
            user {
                id
                firstName
                lastName
                middleName
                birthDate
                gender
                email
                phone
                country
                avatarUrl
            }
        }
    }
`;

export default EDIT_USER_PROFILE;
