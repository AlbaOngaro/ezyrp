import { FormEventHandler, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";
import { useLazyQuery } from "@apollo/client";

import {
  Country,
  InputUpdateUserProfileArgs,
  User,
} from "__generated__/graphql";

import { GET_CLOUDINARY_SIGNATURE } from "lib/queries/GET_CLOUDINARY_SIGNATURE";

import { useCountries } from "hooks/useCountries";
import { useUser } from "hooks/useUser";

import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { Select } from "components/atoms/select/Select";

interface Props {
  profile: User["profile"];
}

export function ProfileForm({ profile: initialProfile }: Props) {
  const { update } = useUser();
  const { data } = useCountries();

  const [getCloudinarySignature] = useLazyQuery(GET_CLOUDINARY_SIGNATURE);

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

    if (files) {
      const { data } = await getCloudinarySignature();

      if (!data) {
        return;
      }

      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("api_key", data.getCloudinarySignature.apiKey);
      formData.append(
        "timestamp",
        data.getCloudinarySignature.timestamp.toString(),
      );
      formData.append("signature", data.getCloudinarySignature.signature);
      formData.append("folder", "crm");

      const url =
        "https://api.cloudinary.com/v1_1/" +
        data.getCloudinarySignature.cloudname +
        "/auto/upload";

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const { secure_url } = (await uploadRes.json()) as { secure_url: string };

      await update({
        variables: {
          updateUserProfileArgs: {
            ...profile,
            photoUrl: secure_url,
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
      <Input label="Profile picture" name="photoUrl" type="file" />

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
