import { Invite, MutationResolvers } from "__generated__/server";
import { surreal } from "server/surreal";

export const createInvites: MutationResolvers["createInvites"] = async (
  _,
  args,
  { accessToken },
) => {
  await surreal.authenticate(accessToken as string);

  const [, { result }] = await surreal.query<[Invite[], Invite[]]>(
    `INSERT INTO invite (email) VALUES ${args.createInviteArgs
      .map(({ email }) => `("${email}")`)
      .join(",")};
			
		SELECT * FROM invite;`,
  );

  return result || [];
};
