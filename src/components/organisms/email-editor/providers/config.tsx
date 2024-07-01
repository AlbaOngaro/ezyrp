import { createContext, PropsWithChildren, useContext } from "react";

type EditorConfig = {
  dnd: boolean;
  toolbar: boolean;
  actions: boolean;
  placeholder: string;
};

const EditorConfigContext = createContext<EditorConfig>({
  dnd: true,
  toolbar: true,
  actions: true,
  placeholder: "Something good here I hope",
});

type Props = PropsWithChildren<Partial<EditorConfig>>;

export function EditorConfigProvider({
  children,
  dnd = true,
  actions = true,
  toolbar = true,
  placeholder = "Something good here I hope",
}: Props) {
  return (
    <EditorConfigContext.Provider
      value={{ dnd, actions, toolbar, placeholder }}
    >
      {children}
    </EditorConfigContext.Provider>
  );
}

export function useEditorConfig() {
  return useContext(EditorConfigContext);
}
