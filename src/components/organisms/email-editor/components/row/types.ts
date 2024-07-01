import { Descendant, Element } from "slate";
import { RenderElementProps } from "slate-react";
import { ColumnElement, RowElement } from "types/slate";

export interface Props extends RenderElementProps {
  element: RowElement;
}

export function isColumnElementArray(
  descendants: Descendant[],
): descendants is ColumnElement[] {
  return descendants.every(
    (descendant) =>
      Element.isElement(descendant) &&
      Element.isElementType(descendant, "column"),
  );
}
