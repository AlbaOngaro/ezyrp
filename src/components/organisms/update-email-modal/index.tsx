import { Form } from "@radix-ui/react-form";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { Input } from "components/atoms/input";
import { Modal } from "components/atoms/modal";
import { Doc } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { Button } from "components/atoms/button";

type Props = {
  email: Doc<"emails"> | null;
  onSuccess: () => void;
};

export function UpdateEmailModal({ email, onSuccess }: Props) {
  const [title, setTitle] = useState(email?.title);
  const updateEmail = useMutation(api.emails.update);

  useEffect(() => {
    setTitle(email?.title);
  }, [email]);

  if (!email) {
    return null;
  }

  return (
    <Modal title="Rename template">
      <Form
        className="mt-2 flex flex-col"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await updateEmail({
              id: email._id,
              title,
            });

            onSuccess();
          } catch (e) {
            console.error(e);
          }
        }}
      >
        <Input
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Button type="submit" className="ml-auto mt-4">
          Save
        </Button>
      </Form>
    </Modal>
  );
}
