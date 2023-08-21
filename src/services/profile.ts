import { profile } from "lib/schema/profile";
import { surreal } from "lib/surreal";
import { Profile } from "lib/types";

export class ProfileService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async read() {
    await surreal.authenticate(this.token);

    const result = await surreal.query<Profile[]>(`SELECT * FROM profile`);
    return (
      profile
        .partial({
          address: true,
          city: true,
          code: true,
          country: true,
        })
        .omit({ user: true })
        // @ts-ignore
        .parse(result[0].result[0])
    );
  }

  async update({
    id,
    ...profile
  }: Partial<Omit<Profile, "user">> & { id: Profile["id"] }) {
    await surreal.authenticate(this.token);
    await surreal.merge(id, profile);
  }
}
