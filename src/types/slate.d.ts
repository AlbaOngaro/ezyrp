import { CSSProperties } from "react";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
  style?: CSSProperties;
};

type ButtonElement = {
  type: "button";
  href: string;
  children: CustomText[];
  style?: CSSProperties;
};

type ColumnElement = {
  type: "column";
  children: (CustomElement | CustomText)[];
  style?: CSSProperties;
};

type ContainerElement = {
  type: "container";
  children: (CustomElement | CustomText)[];
  style?: CSSProperties;
};

type HeadingElement = {
  type: "heading";
  children: CustomText[];
  style?: CSSProperties;
};

type HrElement = {
  type: "hr";
  children: [{ text: "" }];
  style?: CSSProperties;
};

type ImgElement = {
  type: "img";
  src: string;
  children: [{ text: "" }];
  style?: CSSProperties;
};

type LinkElement = {
  type: "link";
  url: string;
  children: CustomText[];
  style?: CSSProperties;
};

type RowElement = {
  type: "row";
  children: (CustomElement | CustomText)[];
  style?: CSSProperties;
};

type SectionElement = {
  type: "section";
  children: (CustomElement | CustomText)[];
  style?: CSSProperties;
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
