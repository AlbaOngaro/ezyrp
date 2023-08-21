import { FormEventHandler, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import { Profile } from "lib/types";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { useProfile } from "hooks/useProfile";
import { useCountries } from "hooks/useCountries";
import { Select } from "components/atoms/select/Select";

interface Props {
  profile: Profile;
}

export function ProfileForm({ profile: initialProfile }: Props) {
  const { update } = useProfile();
  const { data: countries } = useCountries();

  const [profile, setProfile] = useState(initialProfile);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await update(profile);
  };

  return (
    <Form
      className="px-12 py-8 flex flex-col gap-4 lg:w-2/3"
      onSubmit={handleSubmit}
    >
      <Input
        label="Name"
        name="name"
        value={profile.name}
        onChange={(e) =>
          setProfile((curr) => ({
            ...curr,
            name: e.target.value,
          }))
        }
      />

      <hr />

      <Input
        label="Address"
        name="address"
        value={profile?.address}
        onChange={(e) =>
          setProfile((curr) => ({
            ...curr,
            address: e.target.value,
          }))
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="City"
          name="city"
          value={profile.city}
          onChange={(e) =>
            setProfile((curr) => ({
              ...curr,
              city: e.target.value,
            }))
          }
        />

        <Input
          label="Post Code"
          name="code"
          value={profile.code}
          onChange={(e) =>
            setProfile((curr) => ({
              ...curr,
              code: e.target.value,
            }))
          }
        />

        {countries && (
          <Select
            label="Country"
            name="country"
            defaultValue={profile.country}
            options={countries.map((country) => ({
              label: country.name.common,
              value: country.name.common,
            }))}
            onChange={(country) =>
              setProfile((curr) => ({
                ...curr,
                country,
              }))
            }
          />
        )}
      </div>

      <Button size="lg" className="ml-auto px-6">
        Save
      </Button>
    </Form>
  );
}
