import { graphql } from "../../__generated__";

export const GET_CLOUDINARY_SIGNATURE = graphql(`
  query getCloudinarySignature($folder: String = "nimblerp") {
    getCloudinarySignature(folder: $folder) {
      timestamp
      signature
      cloudname
      apiKey
    }
  }
`);
