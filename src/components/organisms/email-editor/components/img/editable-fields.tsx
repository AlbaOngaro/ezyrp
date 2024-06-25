import { get } from "lodash";
import { Link2, Link2Off } from "lucide-react";
import { CSSProperties, useState } from "react";
import { useSlateStatic } from "slate-react";
import { Transforms } from "slate";
import { CustomEditableFieldRenderArgs } from "../../hocs/withActionHandlers/types";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { Input } from "components/atoms/input";

import { getCSSValueWithoutUnit } from "lib/utils/getCSSValueWithoutUnit";
import { Toggle } from "components/atoms/toggle";

type Props = CustomEditableFieldRenderArgs;

export function HeightAndWidthEditableField({ element, onChange }: Props) {
  const editor = useSlateStatic();
  const at = useGetSlatePath(element);
  const [linked, setLinked] = useState(false);

  const onChangeHandler = (
    field: keyof CSSProperties,
    value: CSSProperties[keyof CSSProperties],
  ) => {
    if (linked) {
      Transforms.setNodes(
        editor,
        {
          style: {
            ...(element.style || {}),
            height: value,
            width: value,
          },
        },
        { at },
      );
    } else {
      onChange(field, value);
    }
  };

  return (
    <div className="grid">
      <div className="grid grid-cols-[repeat(3,1fr),2rem] items-center gap-1">
        <label className="text-sm font-semibold self-start">Height</label>
        <Input
          name="height"
          type="number"
          value={getCSSValueWithoutUnit(
            get(element, `style.height`, 0).toString(),
          )}
          onChange={(e) => onChangeHandler("height", `${e.target.value}px`)}
          className="col-span-2 relative [&>input]:pr-8 after:absolute after:content-['px'] after:text-xs after:text-gray-500 after:-translate-y-[50%] after:top-[50%] after:right-2"
        />
        <span className="block w-2 h-4 border-t border-t-gray-300 border-r border-r-gray-300" />

        <Toggle
          pressed={linked}
          onPressedChange={setLinked}
          size="sm"
          className="p-0 w-6 h-6 flex justify-center items-center col-start-4"
        >
          {linked ? (
            <Link2 className="w-4 h-4" />
          ) : (
            <Link2Off className="w-4 h-4" />
          )}
        </Toggle>

        <label className="text-sm font-semibold self-start">Width</label>
        <Input
          name="width"
          type="number"
          value={getCSSValueWithoutUnit(
            get(element, `style.width`, 0).toString(),
          )}
          onChange={(e) => onChangeHandler("width", `${e.target.value}px`)}
          className="col-span-2 relative [&>input]:pr-8 after:absolute after:content-['px'] after:text-xs after:text-gray-500 after:-translate-y-[50%] after:top-[50%] after:right-2"
        />
        <span className="block w-2 h-4 border-b border-b-gray-300 border-r border-r-gray-300" />
      </div>
    </div>
  );
}
