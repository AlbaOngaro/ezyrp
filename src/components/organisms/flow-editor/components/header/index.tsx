import { EllipsisVertical, Save, TriangleAlert } from "lucide-react";

import { useOnSave } from "../../hooks/useOnSave";

import { useFlowValidationState } from "../../hooks/useFlowValidationState";
import { useHasChanges } from "../../hooks/useHasChanges";
import { useGetMenuItems } from "./hooks/useGetMenuItems";
import { Button } from "components/atoms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/atoms/tooltip";
import { Badge } from "components/atoms/badge";
import { Notification } from "components/atoms/notification";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "components/atoms/menubar";
import { cn } from "lib/utils/cn";

export function Header() {
  const hasChanges = useHasChanges();
  const menuItems = useGetMenuItems();
  const { valid, errors } = useFlowValidationState();

  const [onSave, { loading: isSavingWorkflow }] = useOnSave();

  return (
    <header className="absolute top-0 left-0 right-0 w-full p-4 flex justify-end gap-4 z-30">
      <Menubar className="bg-transparent border-none p-0 h-fit w-fit cursor-pointer">
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Button size="icon" variant="outline" className="cursor-pointer">
              <EllipsisVertical className="w-4 h-4" />
            </Button>
          </MenubarTrigger>
          <MenubarContent align="center">
            {menuItems.map((item) => (
              <MenubarItem
                key={item.id}
                className={cn(
                  "cursor-pointer text-base flex justify-start gap-2",
                  item.className,
                )}
                onClick={item.onClick}
              >
                {item.icon} {item.label}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Button
        disabled={!hasChanges || !valid}
        className="flex flex-row gap-2 relative"
        loading={isSavingWorkflow}
        onClick={() => {
          if (valid) {
            return onSave();
          }
        }}
      >
        {hasChanges && <Notification />}
        <Save className="w-4 h-4" /> Save
      </Button>

      {!valid && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="destructive"
                className="w-10 h-10 p-0 flex items-center justify-center"
              >
                <TriangleAlert className="w-4 h-4" />
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{errors[0].message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </header>
  );
}
