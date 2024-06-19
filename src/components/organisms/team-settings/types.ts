import { OrganizationCustomRoleKey } from "@clerk/types";

export type InviteMemberFormValue = {
  email: string;
  role: OrganizationCustomRoleKey;
};
