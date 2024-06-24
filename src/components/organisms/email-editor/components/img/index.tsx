import React, { forwardRef } from "react";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

import { Form } from "@radix-ui/react-form";
import { Transforms } from "slate";
import { withActionHandlers } from "../../hocs/withActionHandlers";
import { useGetSlatePath } from "../../hooks/useGetSlatePath";
import { useGetIsSelected } from "../../hooks/useGetIsSelected";
import { ImgElement } from "types/slate";
import { Input } from "components/atoms/input";
import { useFileUpload } from "hooks/useFileUpload";

interface Props extends RenderElementProps {
  element: ImgElement;
}

const Img = forwardRef<HTMLInputElement, Props>(function Img(
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

  if (ReactEditor.isReadOnly(editor)) {
    const { src, alt, style } = element;
    return (
      <img
        alt={alt}
        src={src}
        style={{
          display: "block",
          outline: "none",
          border: "none",
          textDecoration: "none",
          ...(style || {}),
        }}
      />
    );
  }

  const { src, alt } = element;

  return (
    <Form contentEditable={false} ref={slateRef} {...slateAttributes}>
      <Input
        name="img"
        type="file"
        className="w-full flex justify-center items-center"
        imageClassName="aspect-video w-full h-full object-cover"
        alt={alt}
        value={src}
        onChange={async (e) => {
          if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const fr = new FileReader();
            const promise = new Promise<string | undefined>(
              (resolve, reject) => {
                fr.onload = () => {
                  if (fr.result && typeof fr.result === "string") {
                    return resolve(fr.result);
                  }

                  reject();
                };
              },
            );

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
        disabled={!isSelected}
        {...rest}
      >
        {children}
      </Input>
    </Form>
  );
});

const EnhancedImg = withActionHandlers(Img);

export { EnhancedImg as Img };
