import { Root as Form } from "@radix-ui/react-form";

import { Controller, useFormContext } from "react-hook-form";
import { Button } from "components/atoms/button/Button";
import { Select } from "components/atoms/select/Select";
import { Input } from "components/atoms/input/Input";
import { useCountries } from "hooks/useCountries";
import { Country, Profile } from "__generated__/graphql";
import { twMerge } from "lib/utils/twMerge";

interface Props {
  className?: string;
}

export function ProfileForm({ className }: Props) {
  const { data } = useCountries();

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useFormContext<Profile>();

  return (
    <Form
      className={twMerge("px-12 py-8 flex flex-col gap-4 lg:w-2/3", className)}
      onSubmit={handleSubmit(console.debug, console.error)}
    >
      <Controller
        control={control}
        name="photoUrl"
        render={({ field: { value = "", onChange } }) => (
          <Input
            label="Profile picture"
            name="photoUrl"
            type="file"
            value={value || ""}
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

                onChange(photoUrl);
              }
            }}
          />
        )}
      />

      <Input label="Name" {...register("name")} />

      <Input label="Address" {...register("address")} />

      <div className="grid grid-cols-3 gap-4">
        <Input label="City" {...register("city")} />
        <Input label="Post Code" {...register("code")} />

        {data?.countries && (
          <Controller
            control={control}
            name="country"
            render={({ field: { value, onChange } }) => (
              <Select
                label="Country"
                name="country"
                defaultValue={{
                  label: value,
                  value: value,
                }}
                options={((data.countries || []) as Country[]).map(
                  (country) => ({
                    label: country.name.common,
                    value: country.name.common,
                  }),
                )}
                onChange={(option) => onChange(option?.value)}
              />
            )}
          />
        )}
      </div>

      <Button
        size="lg"
        className="px-6 w-fit"
        disabled={!isValid}
        loading={isSubmitting}
      >
        Save
      </Button>
    </Form>
  );
}
