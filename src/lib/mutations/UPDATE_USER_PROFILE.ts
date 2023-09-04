import { graphql } from "__generated__";

export const UPDATE_USER_PROFILE = graphql(`
  mutation updateUserProfile(
    $updateUserProfileArgs: InputUpdateUserProfileArgs!
  ) {
    updateUserProfile(updateUserProfileArgs: $updateUserProfileArgs) {
      id
      email
      password
      username
      profile {
        photoUrl
        address
        city
        code
        country
        name
      }
    }
  }
`);
