import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

interface Props {
  photoUrl?: string | null;
  seed: string;
}

export function Avatar({ photoUrl, seed }: Props) {
  console.debug(seed);

  return (
    <picture className="relative h-8 w-8 rounded-full overflow-hidden">
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
