import { isDelayableTriggerNode, isEmailActionNode } from "../../types";
import { Props } from "./types";

import { EmailActionNodeSettings } from "./email-action-node-settings";
import { DelayableTriggerNodeSettings } from "./delayable-trigger-node-settings";

export function NodeSettings(props: Props) {
  if (isEmailActionNode(props)) {
    return <EmailActionNodeSettings {...props} />;
  }

  if (isDelayableTriggerNode(props)) {
    return <DelayableTriggerNodeSettings {...props} />;
  }

  return null;
}
