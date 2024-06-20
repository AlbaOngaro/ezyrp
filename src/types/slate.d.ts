import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type HtmlElement = {
  type: "html";
  children: (Exclude<CustomElement, HtmlElement> | CustomText)[];
};
type ParagraphElement = {
  type: "paragraph";
  children: (Exclude<CustomElement, HtmlElement> | CustomText)[];
};
type ButtonElement = {
  type: "button";
  children: CustomText[];
};

type CustomElement = HtmlElement | ParagraphElement | ButtonElement;
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
