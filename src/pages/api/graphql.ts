import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextApiResponse } from "next";

import { typeDefs } from "server/graphql/schema";
import { ACCESS_TOKEN_ID } from "lib/constants";

import * as Query from "server/graphql/resolvers/query";
import * as Mutation from "server/graphql/resolvers/mutation";

const resolvers = {
  Query,
  Mutation,
};

export interface GraphqlContext {
  accessToken?: string;
  res: NextApiResponse;
}

const apolloServer = new ApolloServer<GraphqlContext>({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({
    accessToken: req.cookies[ACCESS_TOKEN_ID] as string,
    res,
  }),
});
