import {
  ForwardRefExoticComponent,
  Fragment,
  PropsWithoutRef,
  RefAttributes,
  forwardRef,
} from "react";
import { RenderElementProps } from "slate-react";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
} from "components/atoms/popover";
import { CustomElement } from "types/slate";

type Options<E extends CustomElement> = {
  renderToolbar: (element: E) => JSX.Element;
};

function defaultRenderToolBar(_element: CustomElement) {
  return <Fragment />;
}

export function withToolbar<
  P extends RenderElementProps,
  E extends HTMLElement,
  O extends CustomElement,
>(
  Component: ForwardRefExoticComponent<P & RefAttributes<E>>,
  { renderToolbar }: Options<O> = { renderToolbar: defaultRenderToolBar },
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<E>> {
  return forwardRef<E, P>(function WithToolbarWrapper(props, ref) {
    const { element } = props;
    const isSelected = useGetIsSelected(element);

    return (
      <Popover open={isSelected}>
        <PopoverAnchor>
          <Component {...props} ref={ref} />
        </PopoverAnchor>

        <PopoverContent
          className="p-2 w-auto"
          side="top"
          sideOffset={16}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {renderToolbar(element as O)}
          <PopoverArrow className="fill-gray-200" />
        </PopoverContent>
      </Popover>
    );
  });
}
