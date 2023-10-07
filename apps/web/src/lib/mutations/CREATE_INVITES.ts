import { graphql } from "__generated__";

export const CREATE_INVITES = graphql(`
  mutation createInvites($createInviteArgs: [InputCreateInviteArgs!]!) {
    createInvites(createInviteArgs: $createInviteArgs) {
      id
      email
      sent_at
    }
  }
`);
