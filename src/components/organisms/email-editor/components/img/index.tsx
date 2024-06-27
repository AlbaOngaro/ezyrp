import React, { forwardRef, useEffect, useState } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

import { Form } from "@radix-ui/react-form";
import { Transforms } from "slate";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { withToolbar } from "../../hocs/withToolbar";
import { HeightAndWidthEditableField } from "./editable-fields";
import { renderToolbar } from "./toolbar";
import { ImgElement } from "types/slate";
import { Input } from "components/atoms/input";
import { useFileUpload } from "hooks/useFileUpload";
import { cn } from "lib/utils/cn";

interface Props extends RenderElementProps {
  element: ImgElement;
}

const Img = forwardRef<any, Props>(function Img(
  {
    attributes: { ref: slateRef, ...slateAttributes },
    element,
    children,
    ...rest
  },
  ref,
) {
  const editor = useSlateStatic();
  const uploadFile = useFileUpload();
  const path = useGetSlatePath(element);
  const isSelected = useGetIsSelected(element);

  const [canChange, setCanChange] = useState(false);

  useEffect(() => {
    if (!isSelected) {
      setCanChange(false);
    }
  }, [isSelected]);

  if (ReactEditor.isReadOnly(editor)) {
    const { src, alt, style } = element;
    const {
      justifyContent = "center",
      alignItems = "center",
      ...additionalStyles
    } = style || {};

    return (
      <picture style={{ display: "flex", justifyContent, alignItems }}>
        <img
          alt={alt}
          src={src}
          style={{
            display: "block",
            ...(additionalStyles || {}),
          }}
        />
        {children}
      </picture>
    );
  }

  const { style, src, alt } = element;
  const {
    justifyContent = "center",
    alignItems = "center",
    ...additionalStyles
  } = style || {};

  return (
    <Form contentEditable={false} ref={slateRef} {...slateAttributes}>
      <Input
        name="img"
        type="file"
        className="w-full flex justify-center items-center"
        onClick={(e) => {
          if (!canChange) {
            e.preventDefault();
            setCanChange(true);
          }
        }}
        onChange={async (e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const fr = new FileReader();
            const promise = new Promise<string>((resolve, reject) => {
              fr.onload = () => {
                if (fr.result && typeof fr.result === "string") {
                  return resolve(fr.result);
                }

                reject();
              };
            });

            fr.readAsDataURL(file);

            const src = await promise;

            Transforms.setNodes(editor, { src }, { at: path });

            try {
              const url = await uploadFile(file);
              if (url) {
                Transforms.setNodes(editor, { src: url }, { at: path });
              }
            } catch (e) {
              console.error(e);
            }
          }
        }}
        accept="image/png, image/jpeg"
        ref={ref}
        alt={alt}
        value={src}
        disabled={!isSelected}
        pictureClassName={cn({
          "hover:after:content-none": !canChange,
        })}
        pictureStyle={{
          display: "flex",
          width: "100%",
          justifyContent,
          alignItems,
        }}
        imageClassName="object-none"
        imgStyle={{
          display: "block",
          ...(additionalStyles || {}),
        }}
        {...rest}
      >
        {children}
      </Input>
    </Form>
  );

  // const { style, alt } = element;
  // const {
  //   justifyContent = "center",
  //   alignItems = "center",
  //   ...additionalStyles
  // } = style || {};

  // return (
  //   <picture
  //     style={{ display: "flex", justifyContent, alignItems }}
  //     contentEditable={false}
  //     ref={mergeRefs(slateRef, ref)}
  //     {...slateAttributes}
  //     {...rest}
  //   >
  //     <img
  //       alt={alt}
  //       src={src}
  // style={{
  //   display: "block",
  //   ...(additionalStyles || {}),
  // }}
  //     />
  //     {children}
  //   </picture>
  // );
});

const EnhancedImg = withToolbar(
  withActionHandlers(Img, {
    editableFields: {
      height: {
        type: "custom",
        render: ({ onChange, element }) => (
          <HeightAndWidthEditableField onChange={onChange} element={element} />
        ),
      },
    },
  }),
  {
    renderToolbar,
  },
);

export { EnhancedImg as Img };
