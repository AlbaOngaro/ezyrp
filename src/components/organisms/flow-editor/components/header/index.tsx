import { EllipsisVertical, Play, Save, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "convex/react";
import { useContext } from "react";

import { useOnSave } from "../../hooks/useOnSave";
import { useFlowValidationState } from "../../hooks/useFlowValidationState";
import { WorkflowContext } from "../../context";
import { useGetMenuItems } from "./hooks/useGetMenuItems";
import { Button } from "components/atoms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/atoms/tooltip";
import { Badge } from "components/atoms/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "components/atoms/menubar";
import { cn } from "lib/utils/cn";
import { Notification } from "components/atoms/notification";
import { api } from "convex/_generated/api";

export function Header() {
  const { hasChanges, settings } = useContext(WorkflowContext);
  const menuItems = useGetMenuItems();
  const sendSms = useAction(api.actions.sms);
  const sendEmail = useAction(api.actions.email);
  const { success, error } = useFlowValidationState();
  const [onSave, { loading: isSavingWorkflow }] = useOnSave();

  return (
    <header className="absolute top-0 left-0 right-0 w-full p-4 flex justify-end gap-4 z-30">
      <Button
        variant="outline"
        size="icon"
        disabled={!success}
        onClick={async () => {
          switch (settings?.action) {
            case "email":
              return toast.promise(
                sendEmail({
                  to: "dolcebunny15@gmail.com",
                  template: settings.template,
                }),
                {
                  loading: "Running flow...",
                  success: "Test run completeded sucessfully.",
                  error: "There was an error running the flow.",
                },
              );
            case "sms": {
              return toast.promise(
                sendSms({
                  to: "+14155552671",
                  message: "Hello, World!",
                }),
                {
                  loading: "Running flow...",
                  success: "Test run completeded sucessfully.",
                  error: "There was an error running the flow.",
                },
              );
            }
            default:
              return;
          }
        }}
      >
        <Play className="w-4 h-4" />
      </Button>

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
        disabled={!hasChanges || !success}
        className="flex flex-row gap-2 relative"
        loading={isSavingWorkflow}
        onClick={onSave}
      >
        {hasChanges && success && <Notification />}
        <Save className="w-4 h-4" /> Save
      </Button>

      {!success && (
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
              <p>{error.issues[0].message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </header>
  );
}
