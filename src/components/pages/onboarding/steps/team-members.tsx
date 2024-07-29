import { useFieldArray } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import { useOnobardingFormContext } from "../hooks/useOnobardingFormContext";
import { Input } from "components/atoms/input";
import { Button } from "components/atoms/button";

export function TeamMembersStep() {
  const { control, register } = useOnobardingFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "teamMembers",
    rules: {
      maxLength: 4,
    },
  });

  console.log(fields);

  return (
    <>
      <div className="flex flex-col gap-4">
        {fields.map((field, i) => (
          <fieldset
            key={field.id}
            className="grid grid-cols-[1fr_1rem] gap-2 items-end"
          >
            <Input
              type="email"
              validations={{
                valueMissing: "This field is required",
                typeMismatch: "Please enter a valid email address",
              }}
              label="Team member email"
              {...register(`teamMembers.${i}.email`, {
                required: true,
              })}
            />

            <Button
              size="icon"
              variant="destructive"
              className="w-4 h-4"
              onClick={(e) => {
                e.preventDefault();
                remove(i);
              }}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </fieldset>
        ))}
      </div>

      <Button
        disabled={fields.length >= 4}
        variant="outline"
        className="w-full"
        onClick={(e) => {
          e.preventDefault();
          append({ email: "" });
        }}
      >
        Add team member <Plus className="w-4 h-4" />
      </Button>
    </>
  );
}
