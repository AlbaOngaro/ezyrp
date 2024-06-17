import { GraphQLError } from "graphql";
import { ZodError, z } from "zod";
import { Surreal } from "surrealdb.js";
import { destroyCookie, setCookie } from "nookies";

import { MutationResolvers, User } from "../../../../__generated__/server";

import { ACCESS_TOKEN_ID } from "../../../../lib/constants";

import { credentials } from "../../../schema/auth";
import { surreal } from "../../../surreal";
import { profile } from "../../../schema/profile";
import { ProfileService } from "../../../services/profile";

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

export const resetPassword: MutationResolvers["resetPassword"] = async (
  _,
  args,
  { accessToken, res },
) => {
  const { currentPassword, newPassword } = await z
    .object({
      currentPassword: z.string(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    })
    .parseAsync(args.credentials)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  await surreal.authenticate(accessToken as string);
  const user = (await (surreal as Surreal).info()) as User;

  try {
    await surreal.signin({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      email: user.email,
      password: currentPassword,
    });
  } catch (error: unknown) {
    throw new GraphQLError("Your credentials did not match.", {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }

  try {
    await surreal.query<[User[]]>(
      `UPDATE ${user.id} MERGE {
        password: crypto::argon2::generate($password)
      }`,
      {
        password: newPassword,
      },
    );

    const token = await surreal.signin({
      NS: "crm",
      DB: "crm",
      SC: "allusers",
      email: user.email,
      password: newPassword,
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

    return (await (surreal as Surreal).info()) as User;
  } catch (error: unknown) {
    throw new GraphQLError("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
  }
};

export const logout: MutationResolvers["logout"] = async (_, __, { res }) => {
  destroyCookie({ res }, ACCESS_TOKEN_ID, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  return true;
};

export const updateUserProfile: MutationResolvers["updateUserProfile"] = async (
  _,
  args,
  { accessToken },
) => {
  const input = await profile
    .omit({ user: true, id: true })
    .parseAsync(args.updateUserProfileArgs)
    .catch((errors) => {
      throw new GraphQLError("Invalid argument value", {
        extensions: {
          code: "BAD_USER_INPUT",
          errors: (errors as ZodError).issues,
        },
      });
    });

  const profileService = new ProfileService(accessToken as string);
  return profileService.update(input);
};

export const deleteAccount: MutationResolvers["deleteAccount"] = async (
  _,
  __,
  { accessToken, res },
) => {
  await surreal.authenticate(accessToken as string);
  const response = await surreal.query(
    `DELETE workspace WHERE id = $auth.workspace;`,
  );

  console.debug(JSON.stringify(response));

  destroyCookie({ res }, ACCESS_TOKEN_ID, {
    secure: true,
    sameSite: true,
    httpOnly: true,
    path: "/",
  });

  return true;
};
