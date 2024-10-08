import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

import { cn } from "lib/utils/cn";

interface Props {
  className?: string;
  photoUrl?: string | null;
  seed: string;
}

export function Avatar({ photoUrl, seed, className }: Props) {
  return (
    <picture
      className={cn("relative h-8 w-8 rounded-full overflow-hidden", className)}
    >
      <img
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={
          photoUrl ||
          createAvatar(initials, {
            seed,
            scale: 75,
          }).toDataUriSync()
        }
        alt=""
      />
    </picture>
  );
}
