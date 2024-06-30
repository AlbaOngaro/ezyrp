import {
  closestCenter,
  rectIntersection,
  CollisionDetection,
} from "@dnd-kit/core";

export const collisionDetection: CollisionDetection = ({
  active,
  droppableContainers,
  ...args
}) => {
  if (active?.data?.current?.type === "section") {
    return rectIntersection({
      ...args,
      active,
      droppableContainers: droppableContainers.filter(
        (container) => container?.data?.current?.type === "section",
      ),
    });
  }

  return closestCenter({
    ...args,
    active,
    droppableContainers: droppableContainers.filter(
      (container) => container?.data?.current?.type !== "section",
    ),
  });
};
