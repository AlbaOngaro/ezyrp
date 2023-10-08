import { graphql } from "__generated__";

export const SETTINGS = graphql(`
  query settings {
    settings {
      start
      end
      days
    }
  }
`);
