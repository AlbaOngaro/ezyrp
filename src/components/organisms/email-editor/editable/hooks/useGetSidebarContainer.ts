import { useLayoutEffect, useState } from "react";

export function useGetSidebarContainer() {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setContainer(document.getElementById("sidebar"));
  }, []);

  return container;
}
