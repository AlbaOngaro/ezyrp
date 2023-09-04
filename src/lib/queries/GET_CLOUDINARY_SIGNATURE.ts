import { graphql } from "__generated__";

export const GET_CLOUDINARY_SIGNATURE = graphql(`
  query getCloudinarySignature {
    getCloudinarySignature {
      timestamp
      signature
      cloudname
      apiKey
    }
  }
`);
