import * as RUITabs from "@radix-ui/react-tabs";
import { twMerge } from "lib/utils/twMerge";

type Props = {
  className?: string;
};

export function Tabs({ className }: Props) {
  return (
    <RUITabs.Root
      className={twMerge(
        "flex flex-col w-[300px] shadow-[0_2px_10px] shadow-blackA2",
        className,
      )}
      defaultValue="tab1"
    >
      <RUITabs.List
        className="shrink-0 flex border-b border-mauve6"
        aria-label="Manage your account"
      >
        <RUITabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
          value="tab1"
        >
          Account
        </RUITabs.Trigger>
        <RUITabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
          value="tab2"
        >
          Password
        </RUITabs.Trigger>
      </RUITabs.List>
      <RUITabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab1"
      ></RUITabs.Content>
      <RUITabs.Content
        className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      ></RUITabs.Content>
    </RUITabs.Root>
  );
}
