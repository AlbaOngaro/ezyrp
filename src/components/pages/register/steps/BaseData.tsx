import React from "react";
import { useFormContext } from "react-hook-form";

import { FormData } from "../types";
import { useRegisterContext } from "../RegisterPage";

import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";

export function BaseData() {
  const { next } = useRegisterContext();
  const {
    register,
    formState: { isValid },
  } = useFormContext<FormData>();

  return (
    <React.Fragment>
      <Input
        type="email"
        label="Email address"
        {...register("email", { shouldUnregister: false })}
      />

      <Input
        type="password"
        label="Password"
        {...register("password", { shouldUnregister: false })}
      />

      <Button
        size="lg"
        disabled={!isValid}
        onClick={(e) => {
          e.preventDefault();
          next();
        }}
      >
        Next
      </Button>
    </React.Fragment>
  );
}
