import { GraphQLError } from "graphql";

export abstract class Service {
  protected token: string;

  constructor(token: string) {
    if (!token) {
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    }
    this.token = token;
  }
}
