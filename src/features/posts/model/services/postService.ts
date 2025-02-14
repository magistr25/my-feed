import { ApolloClient, gql } from '@apollo/client';

import {GET_FULL_POST_QUERY} from "@/features/posts/api/queries/getPost";
import {FullPostData} from "@/features/posts/model/types/types";

// Интерфейс для данных поста
interface PostData {
    id: string;
    isLiked: boolean;
}

// Функция для лайка поста
export const likePost = async (client: ApolloClient<any>, postId: string): Promise<PostData> => {
  const mutation = gql`
      mutation PostLike($input: PostIdRequest!) {
          postLike(input: $input) {
              id
              isLiked
              likesCount
          }
      }
  `;

    const { data } = await client.mutate({
        mutation,
        variables: { input: { id: postId } },
    });

    return data.postLike;
};

// Функция для снятия лайка с поста
export const unlikePost = async (client: ApolloClient<any>, postId: string): Promise<PostData> => {
  const mutation = gql`
      mutation PostUnlike($input: PostIdRequest!) {
          postUnlike(input: $input) {
              id
              isLiked
              likesCount
          }
      }
  `;

    const { data } = await client.mutate({
        mutation,
        variables: { input: { id: postId } },
    });

    return data.postUnlike;
};

// Функция для переключения состояния лайка
export const toggleLike = async (
    client: ApolloClient<any>,
    postId: string,
    isLiked: boolean
): Promise<PostData> => {
    if (isLiked) {
        return await unlikePost(client, postId);
    } else {
        return await likePost(client, postId);
    }
};

// Функция для получения поста по его id
export const getFullPost = async (
    client: ApolloClient<any>,
    id: string
): Promise<FullPostData> => {
    const { data } = await client.query<{ post: FullPostData }>({
        query: GET_FULL_POST_QUERY,
        variables: { input: { id } },
    });

    if (!data || !data.post) {
        throw new Error('Пост не найден');
    }

    return data.post;
};


