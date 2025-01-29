import {gql} from '@apollo/client';

const GET_FAVOURITE_POSTS = gql(`
   query GetFavouritePosts($input: FindFavouritePostsRequest!) {
    favouritePosts(input: $input) {
      data {
      id
      title
      description
      isLiked
      likesCount
      mediaUrl
      createdAt
      updatedAt
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
export default GET_FAVOURITE_POSTS
