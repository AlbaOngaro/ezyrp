import { graphql } from "__generated__";

export const UPDATE_SETTINGS = graphql(`
  mutation updateSettings($updateSettingsInput: InputUpdateSettings) {
    updateSettings(updateSettingsInput: $updateSettingsInput) {
      start
      end
      days
    }
  }
`);
