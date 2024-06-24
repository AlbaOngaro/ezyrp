import { get } from "lodash";
import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { CSSProperties } from "react";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import {
  EditableFields,
  isEditableColorField,
  isEditableNumberField,
  isEditableSelectField,
} from "./types";
import { CustomElement } from "types/slate";
import { Input } from "components/atoms/input";
import { Select } from "components/atoms/select";

type Props = {
  element: CustomElement;
  editableFields: EditableFields;
};

function getValueWithoutUnit(value: string) {
  return value.replace(/[^0-9.]/g, "");
}

export function PropertiesForm({ editableFields, element }: Props) {
  const editor = useSlateStatic();
  const path = useGetSlatePath(element);

  const onChange = (
    field: keyof CSSProperties,
    value: CSSProperties[keyof CSSProperties],
  ) => {
    Transforms.setNodes(
      editor,
      {
        style: {
          ...(element.style || {}),
          [field]: value,
        },
      },
      {
        at: path,
      },
    );
  };

  return (
    <>
      {Object.entries(editableFields).map(([key, field]) => {
        if (isEditableNumberField(field)) {
          const { label, unit = "px", defaultValue } = field;
          return (
            <div className="grid gap-2" key={key}>
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold self-start">
                  {label}
                </label>
                <Input
                  name={key}
                  type="number"
                  defaultValue={defaultValue}
                  value={getValueWithoutUnit(
                    get(element, `style.${key}`, 0).toString(),
                  )}
                  onChange={(e) =>
                    onChange(
                      key as keyof CSSProperties,
                      `${e.target.value}${unit}`,
                    )
                  }
                  className="col-span-2 relative [&>input]:pr-8 after:absolute after:content-['px'] after:text-xs after:text-gray-500 after:-translate-y-[50%] after:top-[50%] after:right-2"
                />
              </div>
            </div>
          );
        }

        if (isEditableColorField(field)) {
          const { label, defaultValue } = field;
          return (
            <div className="grid gap-2" key={key}>
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold">{label}</label>
                <Input
                  name={key}
                  defaultValue={defaultValue}
                  value={get(element, `style.${key}`)}
                  onChange={(color: string) =>
                    onChange(key as keyof CSSProperties, color)
                  }
                  className="col-span-2"
                  type="color"
                />
              </div>
            </div>
          );
        }

        if (isEditableSelectField(field)) {
          const { label, options, defaultValue } = field;

          const value = options.find(
            (option) => option.value === get(element, `style.${key}`),
          );

          return (
            <div className="grid gap-2" key={key}>
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold">{label}</label>

                <Select
                  className="col-span-2"
                  key={key}
                  name={key}
                  options={options}
                  value={value}
                  defaultValue={defaultValue}
                  onChange={(option) => {
                    onChange(key as keyof CSSProperties, option?.value);
                  }}
                />
              </div>
            </div>
          );
        }

        return null;
      })}
    </>
  );
}
