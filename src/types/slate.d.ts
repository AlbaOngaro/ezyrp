import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

type ButtonElement = {
  type: "button";
  children: CustomText[];
};

type ColumnElement = {
  type: "column";
  children: (CustomElement | CustomText)[];
};

type ContainerElement = {
  type: "container";
  children: (CustomElement | CustomText)[];
};

type HeadingElement = {
  type: "heading";
  children: CustomText[];
};

type HrElement = {
  type: "hr";
};

type ImgElement = {
  type: "img";
};

type LinkElement = {
  type: "link";
  children: CustomText[];
};

type RowElement = {
  type: "row";
  children: (CustomElement | CustomText)[];
};

type SectionElement = {
  type: "section";
  children: (CustomElement | CustomText)[];
};

type CustomElement =
  | ParagraphElement
  | ButtonElement
  | ColumnElement
  | ContainerElement
  | HeadingElement
  | HrElement
  | ImgElement
  | LinkElement
  | RowElement
  | SectionElement;

type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
