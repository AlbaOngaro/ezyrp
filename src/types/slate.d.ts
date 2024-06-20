import { CSSProperties } from "react";
import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

interface BaseElement {
  id: string;
  type: string;
  style?: CSSProperties;
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

interface ColumnElement extends BaseElement {
  type: "column";
  children: (CustomElement | CustomText)[];
}

interface ContainerElement extends BaseElement {
  type: "container";
  children: CustomElement[];
}

interface HeadingElement extends BaseElement {
  type: "heading";
  children: CustomText[];
}

interface HrElement extends BaseElement {
  type: "hr";
  children: [{ text: "" }];
}

interface ImgElement extends BaseElement {
  type: "img";
  src: string;
  children: [{ text: "" }];
}

interface LinkElement extends BaseElement {
  type: "link";
  url: string;
  children: CustomText[];
}

interface RowElement extends BaseElement {
  type: "row";
  children: (CustomElement | CustomText)[];
}

interface SectionElement extends BaseElement {
  type: "section";
  children: (CustomElement | CustomText)[];
}

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
