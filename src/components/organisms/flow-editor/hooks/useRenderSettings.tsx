import { useCallback } from "react";
import { Node as RfNode } from "reactflow";
import { Settings } from "lucide-react";
import { Form } from "@radix-ui/react-form";
import {
  ActionNodeData,
  isActionNode,
  NodeData,
  NodeType,
  TriggerNodeData,
} from "../types";
import { Modal, ModalRoot, ModalTrigger } from "components/atoms/modal";
import { Button } from "components/atoms/button";
import { Select } from "components/atoms/select";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

type Node = Pick<RfNode<NodeData, NodeType>, "type" | "data" | "id">;

export function useRenderSettings() {
  const { data: emails = [] } = useQuery(api.emails.list);

  return useCallback((node: Node) => {
    if (isActionNode(node)) {
      if (node.data.action === "email") {
        return (
          <ModalRoot>
            <ModalTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="w-5 h-5 hover:bg-transparent hover:text-blue-500"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </ModalTrigger>
            <Modal title={`${node.data.label} Settings`}>
              <Form>
                <Select
                  label="Template"
                  name="template"
                  options={emails.map((email) => ({
                    label: email.title || "[Untitled]",
                    value: email._id,
                  }))}
                />
              </Form>
            </Modal>
          </ModalRoot>
        );
      }
    }

    return null;
  }, []);
}
