import { createContext, PropsWithChildren, useContext } from "react";
import { Editor } from "slate";

type ParentEditorContextValue = {
  parent: Editor | null;
};

const ParentEditorContext = createContext<ParentEditorContextValue>({
  parent: null,
});

type Props = PropsWithChildren<ParentEditorContextValue>;

export function ParentEditorProvider({ children, parent }: Props) {
  return (
    <ParentEditorContext.Provider value={{ parent }}>
      {children}
    </ParentEditorContext.Provider>
  );
}

export function useParentEditor() {
  return useContext(ParentEditorContext);
}
