import { v4 as uuid, validate } from "uuid";

export function getValidUuid(): string {
  const id = uuid();

  if (validate(id)) {
    return id;
  }

  return getValidUuid();
}
