import { gql } from '@apollo/client';

export const COMPLETE_PROFILE = gql(`
    mutation CompleteProfile($input: EditProfileRequest!) {
      updateUserProfile(input: $input) {
        user {
          firstName
          lastName
          middleName
          phone
        }
      }
    }
`);
