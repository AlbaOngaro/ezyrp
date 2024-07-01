import { set } from "lodash";
import { CSSProperties, useCallback } from "react";
import { RenderLeafProps } from "slate-react";
import { cn } from "lib/utils/cn";

export function useRenderLeaf() {
  return useCallback(({ attributes, children, leaf }: RenderLeafProps) => {
    const { bold = false, italic = false, void: isVoid = false } = leaf;
    let style: CSSProperties = {};
    if (bold) {
      style = set(style, "fontWeight", "bold");
    }
    if (italic) {
      style = set(style, "fontStyle", "italic");
    }

    return (
      <span
        {...attributes}
        style={style}
        className={cn({
          hidden: isVoid,
        })}
      >
        {children}
      </span>
    );
  }, []);
}
