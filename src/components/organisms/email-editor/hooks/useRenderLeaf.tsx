import { set } from "lodash";
import { CSSProperties, useCallback } from "react";
import { RenderLeafProps } from "slate-react";

export function useRenderLeaf() {
  return useCallback(({ attributes, children, leaf }: RenderLeafProps) => {
    let style: CSSProperties = {};
    if (leaf.bold) {
      style = set(style, "fontWeight", "bold");
    }
    if (leaf.italic) {
      style = set(style, "fontStyle", "italic");
    }

    return (
      <span
        {...attributes}
        style={style}
        className="relative after:text-gray-300 after:absolute after:top-0 after:w-full has-[span[data-slate-zero-width]]:block has-[span[data-slate-zero-width]]:after:content-['Something_good_here_I_hope']"
      >
        {children}
      </span>
    );
  }, []);
}
