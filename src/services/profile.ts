import { profile } from "lib/schema/profile";
import { surreal } from "lib/surreal";
import { Profile } from "lib/types";
import { Service } from "services/service";

export class ProfileService extends Service {
  constructor(token: string) {
    super(token);
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
          name: true,
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
