import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from "@apollo/client";
import { GraphQLErrors, NetworkError } from "@apollo/client/errors";
import { onError } from "@apollo/client/link/error";

const getErrorLink = (
  onErrorHandler: (error: GraphQLErrors | NetworkError) => void,
) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      onErrorHandler(graphQLErrors);
    }
    if (networkError) {
      onErrorHandler(networkError);
    }
  });

const httpLink = new HttpLink({ uri: "/api/graphql" });

export function getClient(
  onError: (error: GraphQLErrors | NetworkError) => void,
): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([getErrorLink(onError), httpLink]),
  });
}
