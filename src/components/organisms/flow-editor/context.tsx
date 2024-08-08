import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Node, Edge } from "reactflow";
import { isEqual } from "lodash";

import {
  isActionNode,
  isEventTriggerNode,
  isEmailActionNode,
  isSmsActionNode,
  isTriggerNode,
  NodeData,
  NodeType,
} from "./types";

import { Doc, Id } from "convex/_generated/dataModel";
import { Settings } from "convex/workflows";

type WorkflowContextValue = Doc<"workflows"> & {
  setNodes: Dispatch<SetStateAction<Node<NodeData, NodeType>[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  hasChanges: boolean;
};

export const WorkflowContext = createContext<WorkflowContextValue>({
  _id: "" as Id<"workflows">,
  _creationTime: 0,
  title: "",
  // @ts-ignore
  settings: {},
  nodes: [],
  setNodes: () => [],
  edges: [],
  setEdges: () => [],
  hasChanges: false,
});

export function getSettings(nodes: Node[]): Settings | undefined {
  const trigger = nodes.find((node) => isTriggerNode(node));
  const action = nodes.find((node) => isActionNode(node));

  if (!trigger || !action) {
    return undefined;
  }

  if (isEmailActionNode(action)) {
    if (isEventTriggerNode(trigger)) {
      return {
        event: trigger.data.event,
        action: action.data.action,
        // @ts-ignore
        template: action.data.template,
        delay: trigger.data.delay,
      };
    }

    return {
      event: trigger.data.event,
      action: action.data.action,
      // @ts-ignore
      template: action.data.template,
    };
  }

  if (isSmsActionNode(action)) {
    if (isEventTriggerNode(trigger)) {
      return {
        event: trigger.data.event,
        action: action.data.action,
        delay: trigger.data.delay,
      };
    }

    // @todo: figure out why this is breaking now...
    // @ts-ignore
    return {
      event: trigger.data.event,
      action: action.data.action,
    };
  }

  return undefined;
}

export function WorkflowProvider({
  children,
  workflow,
}: PropsWithChildren<{
  workflow: Doc<"workflows">;
}>) {
  const [nodes, setNodesInternal] = useState<Node<NodeData, NodeType>[]>([]);
  const [edges, setEdgesInternal] = useState<Edge[]>([]);
  const [settings, setSettings] = useState<Doc<"workflows">["settings"]>();

  useEffect(() => {
    setEdgesInternal(workflow.edges);
    setNodesInternal(workflow.nodes);
    setSettings(workflow.settings);
  }, [workflow]);

  const setNodes = useCallback(
    (newNodes: SetStateAction<Node<NodeData, NodeType>[]>) => {
      setNodesInternal(newNodes);
      if (typeof newNodes == "function") {
        setSettings(getSettings(newNodes(nodes)));
      } else {
        setSettings(getSettings(newNodes));
      }
    },
    [nodes],
  );

  const setEdges = useCallback((edges: SetStateAction<Edge[]>) => {
    setEdgesInternal(edges);
  }, []);

  const hasChanges =
    !isEqual(
      edges.map(({ selected: _selected, ...edge }) => edge),
      workflow.edges.map(({ selected: _selected, ...edge }) => edge),
    ) ||
    !isEqual(
      nodes.map(
        ({ selected: _selected, dragging: _dragging, ...node }) => node,
      ),
      workflow.nodes.map(
        ({ selected: _selected, dragging: _dragging, ...node }) => node,
      ),
    );

  return (
    <WorkflowContext.Provider
      value={{
        ...workflow,
        settings,
        nodes,
        setNodes,
        edges,
        setEdges,
        hasChanges,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}
