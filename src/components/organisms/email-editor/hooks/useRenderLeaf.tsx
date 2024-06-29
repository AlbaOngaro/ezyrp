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
          "relative after:text-gray-300 after:absolute after:top-0 after:w-full has-[span[data-slate-zero-width]]:block has-[span[data-slate-zero-width]]:after:content-['Something_good_here_I_hope']":
            !isVoid,
        })}
      >
        {children}
      </span>
    );
  }, []);
}
