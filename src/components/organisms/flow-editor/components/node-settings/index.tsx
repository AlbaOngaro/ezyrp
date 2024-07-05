import { isEventTriggerNode, isEmailActionNode } from "../../types";
import { Props } from "./types";

import { EmailActionNodeSettings } from "./email-action-node-settings";
import { EventTriggerNodeSettings } from "./event-trigger-node-settings";

export function NodeSettings(props: Props) {
  if (isEmailActionNode(props)) {
    return <EmailActionNodeSettings {...props} />;
  }

  if (isEventTriggerNode(props)) {
    return <EventTriggerNodeSettings {...props} />;
  }

  return null;
}
