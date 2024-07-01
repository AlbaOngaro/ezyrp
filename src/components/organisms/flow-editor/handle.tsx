import { HandleProps, Handle as RFHandle, Position } from "reactflow";
import { cn } from "lib/utils/cn";

export function Handle({ type, position }: HandleProps) {
  return (
    <RFHandle
      type={type}
      position={position}
      className={cn("bg-white rounded-full border-2 border-gray-300 w-3 h-3", {
        "-right-4": position === Position.Right,
        "-left-4": position === Position.Left,
        "-top-4": position === Position.Top,
        "-bottom-4": position === Position.Bottom,
      })}
    />
  );
}
