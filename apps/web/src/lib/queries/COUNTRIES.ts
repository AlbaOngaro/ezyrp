import { graphql } from "../../__generated__";

export const COUNTRIES = graphql(`
  query countries {
    countries {
      name {
        common
        official
      }
    }
  }
`);
