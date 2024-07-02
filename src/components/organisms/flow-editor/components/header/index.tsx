import { Play, Save } from "lucide-react";

import { useOnSave } from "../../hooks/useOnSave";

import { Button } from "components/atoms/button";

export function Header() {
  const [onSave, { loading: isSavingWorkflow }] = useOnSave();

  return (
    <header className="absolute top-0 left-0 right-0 w-full p-4 flex justify-end gap-4 z-30">
      <Button variant="outline" size="icon">
        <Play className="w-4 h-4" />
      </Button>

      <Button
        className="flex flex-row gap-2"
        loading={isSavingWorkflow}
        onClick={onSave}
      >
        <Save className="w-4 h-4" /> Save
      </Button>
    </header>
  );
}
