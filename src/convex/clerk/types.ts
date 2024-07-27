import { plan } from "../schema";

type Plan = typeof plan.type;

export namespace OrganzationInvitation {
  export type Data = {
    created_at: number;
    email_address: string;
    id: string;
    object: string;
    organization_id: string;
    role: string;
    status: string;
    updated_at: number;
  };
}

export namespace User {
  export type Data = {
    birthday: string;
    created_at: number;
    email_addresses: EmailAddress[];
    external_accounts: any[];
    external_id: string;
    first_name: string;
    gender: string;
    id: string;
    image_url: string;
    last_name: string;
    last_sign_in_at: number;
    object: string;
    password_enabled: boolean;
    phone_numbers: any[];
    primary_email_address_id: string;
    primary_phone_number_id: any;
    primary_web3_wallet_id: any;
    private_metadata: PrivateMetadata;
    profile_image_url: string;
    public_metadata: PublicMetadata;
    two_factor_enabled: boolean;
    unsafe_metadata: UnsafeMetadata;
    updated_at: number;
    username: any;
    web3_wallets: any[];
  };

  type EmailAddress = {
    email_address: string;
    id: string;
    linked_to: any[];
    object: string;
    verification: Verification;
  };

  type Verification = {
    status: string;
    strategy: string;
  };

  type PrivateMetadata = {};

  type PublicMetadata = {};

  type UnsafeMetadata = {};
}

export namespace Organization {
  export type Data = {
    created_at: number;
    created_by: string;
    id: string;
    image_url: string;
    logo_url: string;
    name: string;
    object: string;
    public_metadata: PublicMetadata;
    slug: string;
    updated_at: number;
  };

  export type PublicMetadata = {
    plan: Plan;
  };
}

export namespace OrganizationMembership {
  export type Data = {
    created_at: number;
    id: string;
    object: string;
    organization: Organization;
    public_user_data: PublicUserData;
    role: string;
    updated_at: number;
  };

  export type Organization = {
    created_at: number;
    created_by: string;
    id: string;
    image_url: string;
    logo_url: string;
    name: string;
    object: string;
    public_metadata: PublicMetadata;
    slug: string;
    updated_at: number;
  };

  export type PublicMetadata = {
    plan: Plan;
  };

  export type PublicUserData = {
    first_name: string;
    identifier: string;
    image_url: string;
    last_name: string;
    profile_image_url: string;
    user_id: string;
  };
}

// type UserCreatedEvent = {
//   data: User.Data;
//   object: string;
//   type: "user.created";
// };

// type UserUpdatedEvent = {
//   data: User.Data;
//   object: string;
//   type: "user.updated";
// };

// type OrganizationInvitationRevokedEvent = {
//   type: "organizationInvitation.revoked";
//   data: OrganzationInvitation.Data;
//   object: "organizationInvitation";
// };

// type OrganizationInvitationAcceptedEvent = {
//   type: "organizationInvitation.accepted";
//   data: OrganzationInvitation.Data;
//   object: "organizationInvitation";
// };

type OrganizationCreatedEvent = {
  type: "organization.created";
  data: Organization.Data;
  object: "organization";
};

type OrganizationUpdatedEvent = {
  type: "organization.updated";
  data: Organization.Data;
  object: "organization";
};

type OrganizationDeletedEvent = {
  type: "organization.deleted";
  data: Organization.Data;
  object: "organization";
};

type OrganizationMembershipCreatedEvent = {
  type: "organizationMembership.created";
  data: OrganizationMembership.Data;
  object: "organizationMembership";
};

type OrganizationMembershipUpdatedEvent = {
  type: "organizationMembership.updated";
  data: OrganizationMembership.Data;
  object: "organizationMembership";
};

type OrganizationMembershipDeletedEvent = {
  type: "organizationMembership.deleted";
  data: OrganizationMembership.Data;
  object: "organizationMembership";
};

export type WebhookPayload =
  // | UserCreatedEvent
  // | UserUpdatedEvent
  // | OrganizationInvitationRevokedEvent
  // | OrganizationInvitationAcceptedEvent
  | OrganizationCreatedEvent
  | OrganizationUpdatedEvent
  | OrganizationDeletedEvent
  | OrganizationMembershipUpdatedEvent
  | OrganizationMembershipCreatedEvent
  | OrganizationMembershipDeletedEvent;
