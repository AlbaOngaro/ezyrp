import { Form } from "@radix-ui/react-form";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { Select } from "components/atoms/select";
import { useCountries } from "hooks/useCountries";
import { Doc } from "convex/_generated/dataModel";

type Customer = Doc<"customers">;

export function CustomerForm() {
  const { data } = useCountries();

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, isDirty, isValid },
  } = useFormContext<Customer>();

  return (
    <Form
      className="mt-2 grid grid-cols-12 gap-y-2 gap-x-4"
      onSubmit={handleSubmit(console.debug, console.error)}
    >
      <Controller
        control={control}
        name="photoUrl"
        render={({ field: { value, onChange } }) => (
          <Input
            label="Profile picture"
            className="col-span-3"
            type="file"
            name="photoUrl"
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

      <Input
        className="col-span-6 row-start-2"
        label="Name"
        placeholder="Jane Doe"
        type="text"
        validations={{
          valueMissing: "This field is required",
        }}
        {...register("name", {
          required: true,
        })}
      />

      <Input
        className="col-span-6 row-start-3"
        label="Email"
        placeholder="jane.doe@example.com"
        type="email"
        validations={{
          valueMissing: "This field is required",
        }}
        {...register("email", { required: true })}
      />

      <Input
        label="Address"
        className="col-span-12"
        validations={{
          valueMissing: "This field is required",
        }}
        {...register("address", { required: true })}
      />

      <Input
        className="col-span-4"
        label="Code"
        validations={{
          valueMissing: "This field is required",
        }}
        {...register("code", {
          required: true,
        })}
      />
      <Input
        className="col-span-4"
        label="City"
        validations={{
          valueMissing: "This field is required",
        }}
        {...register("city", {
          required: true,
        })}
      />
      <Controller
        control={control}
        name="country"
        rules={{
          required: true,
        }}
        render={({ field: { value = "", onChange } }) => (
          <Select
            className="col-span-4"
            name="country"
            label="Country"
            value={{ label: value || "", value: value || "" }}
            options={(data || []).map((country) => ({
              label: country.name.common,
              value: country.name.common,
            }))}
            onChange={(option) => onChange(option?.value)}
          />
        )}
      />

      <Button
        disabled={!isDirty || !isValid}
        loading={isSubmitting}
        className="w-fit min-w-[100px] mt-4 ml-auto col-start-12 row-start-8"
      >
        Save
      </Button>
    </Form>
  );
}
