import { Surreal } from "surrealdb.js";
import { profile } from "../schema/profile";
import { surreal } from "../surreal";
import { Service } from "./service";
import {
  MutationUpdateUserProfileArgs,
  Profile,
  User,
} from "../../__generated__/server";
import { user } from "../schema/auth";

export class ProfileService extends Service {
  constructor(token: string) {
    super(token);
  }

  async read(): Promise<Profile> {
    await surreal.authenticate(this.token);
    const result = await surreal.query<Profile[]>(`SELECT * FROM profile`);

    // @ts-ignore
    return profile.omit({ user: true }).parse(result[0].result[0]);
  }

  async update(input: MutationUpdateUserProfileArgs["updateUserProfileArgs"]) {
    await surreal.authenticate(this.token);

    const info = (await (surreal as Surreal).info()) as User;

    const record = await surreal.query(
      `UPDATE profile MERGE ${JSON.stringify(input)} WHERE user = ${info.id}`,
    );

    return user.parse({
      ...info,
      // @ts-ignore
      profile: record[0].result[0],
    });
  }
}
