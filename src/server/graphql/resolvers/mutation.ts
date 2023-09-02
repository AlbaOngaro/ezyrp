import { GraphQLError } from "graphql";
import { setCookie } from "nookies";
import { Surreal } from "surrealdb.js";
import { ZodError } from "zod";
import { ACCESS_TOKEN_ID } from "lib/constants";
import { surreal } from "server/surreal";
import { credentials } from "server/schema/auth";
import { MutationResolvers, User } from "__generated__/server";

export const login: MutationResolvers["login"] = async (_, args, { res }) => {
  const { password, email } = await credentials
    .partial({ workspace: true })
    .omit({ username: true })
    .parseAsync(args.credentials)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const token = await surreal
    .signin({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      email,
      password,
    })
    .catch(() => {
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    });

  if (!token) {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  setCookie({ res }, ACCESS_TOKEN_ID, token, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  const record = await (surreal as Surreal).info();
  return record as User;
};

export const register: MutationResolvers["register"] = async (
  _,
  args,
  { res },
) => {
  const { username, password, email, workspace } = await credentials
    .partial({ username: true, workspace: true })
    .parseAsync(args.credentials)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const token = await surreal
    .signup({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      workspace,
      username,
      password,
      email,
    })
    .catch(() => {
      throw new GraphQLError("You are not authorized to perform this action.", {
        extensions: {
          code: "FORBIDDEN",
        },
      });
    });

  if (!token) {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }

  setCookie({ res }, ACCESS_TOKEN_ID, token, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  const record = await (surreal as Surreal).info();
  return record as User;
};
