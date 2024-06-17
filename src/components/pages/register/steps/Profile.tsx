import React from "react";
import { useFormContext } from "react-hook-form";

import { FormData } from "../types";

import { Button } from "components/atoms/button/Button";
import { ProfileForm } from "components/organisms/profile-form/ProfileForm";
import { useRegisterContext } from "components/pages/register/RegisterPage";

export function Profile() {
  const {
    formState: { isValid },
  } = useFormContext<FormData>();
  const { prev, next } = useRegisterContext();

  return (
    <React.Fragment>
      <ProfileForm showSaveButton={false} className="!w-full p-0" />
      <footer className="flex flex-row gap-2">
        <Button
          variant="secondary"
          className="w-full"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            prev();
          }}
        >
          Back
        </Button>
        <Button
          className="w-full"
          size="lg"
          disabled={!isValid}
          onClick={(e) => {
            e.preventDefault();
            next();
          }}
        >
          Next
        </Button>
      </footer>
    </React.Fragment>
  );
}
