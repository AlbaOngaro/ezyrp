import { graphql } from "__generated__";

export const STATS = graphql(`
  query stats($filters: InputStatsFilters) {
    stats(filters: $filters) {
      pending {
        name
        value
        change
      }
      overdue {
        name
        value
        change
      }
      paid {
        name
        value
        change
      }
    }
  }
`);
