import { CSSProperties } from "react";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

interface BaseElement {
  id: string;
  type: string;
  style?: CSSProperties;
  skipUpdate?: boolean;
}

interface ParagraphElement extends BaseElement {
  type: "paragraph";
  children: CustomText[];
}

interface ButtonElement extends BaseElement {
  type: "button";
  href: string;
  target?: "_blank" | "_self";
  children: CustomText[];
}

interface SectionElement extends BaseElement {
  type: "section";
  contents: CustomElement[];
  children: [{ text: "" }];
}

interface RowElement extends BaseElement {
  type: "row";
  columns: ColumnElement[];
  children: [{ text: "" }];
}

interface ColumnElement extends BaseElement {
  type: "column";
  width: number;
  children: CustomElement[];
}

interface HeadingElement extends BaseElement {
  type: "heading";
  children: CustomText[];
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

interface HrElement extends BaseElement {
  type: "hr";
  children: [{ text: "" }];
}

interface ImgElement extends BaseElement {
  type: "img";
  src: string;
  alt?: string;
  children: [{ text: "" }];
}

interface LinkElement extends BaseElement {
  type: "link";
  url: string;
  children: CustomText[];
}

interface HeadingElement extends BaseElement {
  tye: "heading";
  children: CustomText[];
}

type CustomElement =
  | ParagraphElement
  | ButtonElement
  | ColumnElement
  | HeadingElement
  | HrElement
  | ImgElement
  | LinkElement
  | RowElement
  | HeadingElement
  | SectionElement;

type CustomText = {
  text: string;
  void?: boolean;
  bold?: boolean;
  italic?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
