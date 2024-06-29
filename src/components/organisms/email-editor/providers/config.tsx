import { createContext, PropsWithChildren, useContext } from "react";

type EditorConfig = {
  dnd: boolean;
  toolbar: boolean;
  actions: boolean;
};

const EditorConfigContext = createContext<EditorConfig>({
  dnd: true,
  toolbar: true,
  actions: true,
});

type Props = PropsWithChildren<Partial<EditorConfig>>;

export function EditorConfigProvider({
  children,
  dnd = true,
  actions = true,
  toolbar = true,
}: Props) {
  return (
    <EditorConfigContext.Provider value={{ dnd, actions, toolbar }}>
      {children}
    </EditorConfigContext.Provider>
  );
}

export function useEditorConfig() {
  return useContext(EditorConfigContext);
}
