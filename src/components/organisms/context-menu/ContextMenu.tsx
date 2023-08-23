import * as RUIContextMenu from "@radix-ui/react-context-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { Fragment } from "react";

import { Props } from "./types";

export function ContextMenu({ items, type, ...rest }: Props) {
  const Content =
    type === "sub" ? RUIContextMenu.SubContent : RUIContextMenu.Content;

  return (
    <Content
      className="min-w-[220px] py-2 bg-white rounded-md overflow-hidden shadow-lg"
      asChild
      {...rest}
    >
      <nav>
        {items.map((item, i) => {
          switch (item.type) {
            case "item":
              return (
                <RUIContextMenu.Item
                  key={i}
                  onClick={item.onClick}
                  className="text-sm flex flex-row justify-between px-4 py-1 text-gray-800 focus-visible:outline-none hover:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:bg-gray-50 data-[disabled]:hover:bg-gray-50"
                >
                  {item.label}
                </RUIContextMenu.Item>
              );
            case "label":
              return (
                <RUIContextMenu.Label
                  key={i}
                  className="flex flex-row justify-between px-4 py-2 text-gray-800 text-xs font-bold focus-visible:outline-none"
                >
                  {item.label}
                </RUIContextMenu.Label>
              );
            case "separator":
              return (
                <RUIContextMenu.Separator
                  key={i}
                  className="h-[1px] bg-gray-100 m-2 focus-visible:outline-none"
                />
              );
            case "checkbox":
              return (
                <RUIContextMenu.CheckboxItem
                  key={i}
                  className="text-sm flex flex-row justify-between items-center px-4 py-1 text-gray-800 focus-visible:outline-none hover:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:bg-gray-50 data-[disabled]:hover:bg-gray-50"
                  checked={item.checked}
                  onCheckedChange={item.onCheckedChange}
                >
                  {item.label}
                  <RUIContextMenu.ItemIndicator>
                    <CheckIcon />
                  </RUIContextMenu.ItemIndicator>
                </RUIContextMenu.CheckboxItem>
              );
            case "radio":
              return (
                <Fragment key={i}>
                  <RUIContextMenu.Label className="flex flex-row justify-between px-4 py-2 text-gray-800 focus-visible:outline-none text-xs font-bold">
                    {item.label}
                  </RUIContextMenu.Label>
                  <RUIContextMenu.RadioGroup
                    value={item.value}
                    onValueChange={item.onValueChange}
                  >
                    {item.children.map((child, y) => (
                      <RUIContextMenu.RadioItem
                        key={`${i}-${y}`}
                        className="text-sm flex flex-row justify-between items-center px-4 py-1 text-gray-800 focus-visible:outline-none hover:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:bg-gray-50 data-[disabled]:hover:bg-gray-50"
                        value={child.value}
                      >
                        {child.label}
                        <RUIContextMenu.ItemIndicator>
                          <DotFilledIcon />
                        </RUIContextMenu.ItemIndicator>
                      </RUIContextMenu.RadioItem>
                    ))}
                  </RUIContextMenu.RadioGroup>
                </Fragment>
              );
            case "group":
              return (
                <Fragment key={i}>
                  <RUIContextMenu.Label
                    key={i}
                    className="flex flex-row justify-between px-4 py-2 text-gray-800 text-xs font-bold focus-visible:outline-none"
                  >
                    {item.label}
                  </RUIContextMenu.Label>
                  <RUIContextMenu.Group>
                    {item.children.map((child, y) => (
                      <RUIContextMenu.Item
                        key={`${i}-${y}`}
                        onClick={child.onClick}
                        className="text-sm flex flex-row justify-between px-4 py-1 text-gray-800 focus-visible:outline-none hover:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:bg-gray-50 data-[disabled]:hover:bg-gray-50"
                      >
                        {child.label}
                      </RUIContextMenu.Item>
                    ))}
                  </RUIContextMenu.Group>
                </Fragment>
              );
            case "sub":
              return (
                <RUIContextMenu.Sub key={i}>
                  <RUIContextMenu.SubTrigger className="text-sm flex flex-row justify-between items-center px-4 py-1 text-gray-800 focus-visible:outline-none hover:bg-gray-100 data-[disabled]:text-gray-400 data-[disabled]:bg-gray-50 data-[disabled]:hover:bg-gray-50">
                    {item.label} <ChevronRightIcon />
                  </RUIContextMenu.SubTrigger>
                  <RUIContextMenu.Portal>
                    <ContextMenu
                      type="sub"
                      items={item.children}
                      sideOffset={2}
                      alignOffset={-5}
                    />
                  </RUIContextMenu.Portal>
                </RUIContextMenu.Sub>
              );
            default:
              return null;
          }
        })}
      </nav>
    </Content>
  );
}
