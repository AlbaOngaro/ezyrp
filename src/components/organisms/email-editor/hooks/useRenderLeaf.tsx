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
      <span {...attributes} style={style}>
        {children}
      </span>
    );
  }, []);
}
