import {gql} from "@apollo/client";

const GET_POSTS = gql(`
   query GetPosts($input: FindPostsRequest!) {
  posts(input: $input) {
    data {
      id
      title
      description
      mediaUrl
      createdAt
      author {
        id
        firstName
        lastName
        avatarUrl
      }
    }
    pageInfo {
      afterCursor
      count
      perPage
    }
  }
}
`);
export default GET_POSTS
