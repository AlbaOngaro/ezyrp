import { FormEventHandler, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";

import {
  Country,
  InputUpdateUserProfileArgs,
  User,
} from "../../../__generated__/graphql";

import { useCountries } from "../../../hooks/useCountries";
import { useUser } from "../../../hooks/useUser";

import { Input } from "../../atoms/input/Input";
import { Button } from "../../atoms/button/Button";
import { Select } from "../../atoms/select/Select";
import { useFileUpload } from "../../../hooks/useFileUpload";

interface Props {
  profile: User["profile"];
}

export function ProfileForm({ profile: initialProfile }: Props) {
  const { update } = useUser();
  const { data } = useCountries();
  const handleFileUpload = useFileUpload();

  const [profile, setProfile] = useState<InputUpdateUserProfileArgs>({
    photoUrl: initialProfile?.photoUrl || "",
    address: initialProfile?.address || "",
    city: initialProfile?.city || "",
    code: initialProfile?.code || "",
    country: initialProfile?.country || "",
    name: initialProfile?.name || "",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const files = (e.target as HTMLFormElement).querySelector<HTMLInputElement>(
      "input[type=file]",
    )?.files;

    if (files && files.length > 0) {
      const photoUrl = await handleFileUpload(files[0]);

      await update({
        variables: {
          updateUserProfileArgs: {
            ...profile,
            photoUrl,
          },
        },
      });

      return;
    }

    await update({
      variables: {
        updateUserProfileArgs: profile,
      },
    });
  };

  return (
    <Form
      className="px-12 py-8 flex flex-col gap-4 lg:w-2/3"
      onSubmit={handleSubmit}
    >
      <Input
        label="Profile picture"
        name="photoUrl"
        type="file"
        value={profile.photoUrl || ""}
        onChange={async (e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const fr = new FileReader();
            const promise = new Promise<string | undefined>(
              (resolve, reject) => {
                fr.onload = () => {
                  if (fr.result && typeof fr.result === "string") {
                    return resolve(fr.result);
                  }

                  reject();
                };
              },
            );

            fr.readAsDataURL(file);

            const photoUrl = await promise;

            setProfile((curr) => ({
              ...curr,
              photoUrl,
            }));
          }
        }}
      />

      <Input
        label="Name"
        name="name"
        value={profile.name || ""}
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
        value={profile.address || ""}
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
          value={profile.city || ""}
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
          value={profile.code || ""}
          onChange={(e) =>
            setProfile((curr) => ({
              ...curr,
              code: e.target.value,
            }))
          }
        />

        {data?.countries && (
          <Select
            label="Country"
            name="country"
            defaultValue={profile.country || ""}
            options={((data.countries || []) as Country[]).map((country) => ({
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
