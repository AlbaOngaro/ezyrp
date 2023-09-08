import { graphql } from "__generated__";

export const ITEMS = graphql(`
  query items($filters: InputItemsFilters) {
    items(filters: $filters) {
      total
      results {
        id
        name
        quantity
        price
        description
      }
    }
  }
`);
