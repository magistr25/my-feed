import {gql} from "@apollo/client";

const GET_USER_DATA = gql(`
    query GetUserData {
  userMe {
    avatarUrl
    birthDate
    country
    createdAt
    deletedAt
    email
    firstName
    gender
    id
    lastName
    middleName
    phone
    updatedAt
  }
}
`);
export default GET_USER_DATA
