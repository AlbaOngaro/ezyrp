import { graphql } from "__generated__";

export const CREATE_SUBSCRIPTION = graphql(`
  mutation createSubscription($subscriptionInput: SubscriptionInput!) {
    createSubscription(subscriptionInput: $subscriptionInput) {
      endpoint
      expirationTime
      keys {
        p256dh
        auth
      }
    }
  }
`);
