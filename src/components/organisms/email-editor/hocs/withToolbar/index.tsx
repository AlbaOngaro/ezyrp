import { JSXElementConstructor, Ref, RefAttributes } from "react";
import { RenderElementProps } from "slate-react";

export function withToolbar<
  P extends RenderElementProps,
  E extends HTMLElement,
>(
  Component: JSXElementConstructor<P & RefAttributes<E>>,
): JSXElementConstructor<P & RefAttributes<E>> {
  return function WithToolbarWrapper(props: P, ref: Ref<E>) {
    console.log("props", props);
    console.log("ref", ref);

    return <Component {...props} ref={ref} />;
  };
}
