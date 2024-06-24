import { get } from "lodash";
import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { CSSProperties } from "react";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { EditableFields } from "./types";
import { CustomElement } from "types/slate";
import { Input } from "components/atoms/input";

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
      {Object.entries(editableFields).map(([field, { label, type }]) => {
        if (type === "number") {
          return (
            <div className="grid gap-2" key={field}>
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm font-semibold self-start">
                  {label}
                </label>
                <Input
                  name={field}
                  type="number"
                  value={getValueWithoutUnit(
                    get(element, `style.${field}`, 0).toString(),
                  )}
                  onChange={(e) =>
                    onChange(
                      field as keyof CSSProperties,
                      `${e.target.value}px`,
                    )
                  }
                  className="col-span-2 relative [&>input]:pr-8 after:absolute after:content-['px'] after:text-xs after:text-gray-500 after:-translate-y-[50%] after:top-[50%] after:right-2"
                />
              </div>
            </div>
          );
        }

        return (
          <div className="grid gap-2" key={field}>
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-sm font-semibold">{label}</label>
              <Input
                name={field}
                value={get(element, `style.${field}`)}
                onChange={(e) =>
                  onChange(field as keyof CSSProperties, e.target.value)
                }
                className="col-span-2"
                type="color"
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
