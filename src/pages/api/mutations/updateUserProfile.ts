import { gql } from "@apollo/client";

const UPDATE_USER_PROFILE = gql`
    mutation UserEditProfile($input: EditProfileRequest!) {
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

export default UPDATE_USER_PROFILE;
