import { useCallback } from "react";
import { useStoreApi, Node } from "reactflow";
import { get } from "lodash";

const MIN_DISTANCE = 150;

export function useGetClosestEdge() {
  const store = useStoreApi();

  return useCallback((node: Node) => {
    const { nodeInternals } = store.getState();
    const storeNodes = Array.from(nodeInternals.values());

    const closestNode = storeNodes.reduce<{
      distance: number;
      node: Node | null;
    }>(
      (acc, curr) => {
        if (curr.id !== node.id) {
          const dx =
            get(curr, "positionAbsolute.x", 0) -
            get(node, "positionAbsolute.x", 0);

          const dy =
            get(curr, "positionAbsolute.y", 0) -
            get(node, "positionAbsolute.y", 0);

          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < acc.distance && d < MIN_DISTANCE) {
            return {
              distance: d,
              node: curr,
            };
          }
        }

        return acc;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      },
    );

    if (!closestNode.node) {
      return null;
    }

    const closeNodeIsSource =
      get(closestNode, "node.positionAbsolute.x", 0) <
      get(node, "positionAbsolute.x", 0);

    if (closeNodeIsSource) {
      return {
        id: `${closestNode.node.id}-${node.id}`,
        source: closestNode.node.id,
        target: node.id,
      };
    }

    return {
      id: `${node.id}-${closestNode.node.id}`,
      source: node.id,
      target: closestNode.node.id,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
