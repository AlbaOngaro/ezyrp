import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { RegisterContextValue, Variant, FormData } from "./types";
import { variants, steps } from "./constants";
import { schema } from "./schema";

import { CenteredLayout } from "components/layouts/centered/CenteredLayout";
import { Card } from "components/atoms/card/Card";
import { Heading } from "components/atoms/heading/Heading";
import { useUser } from "hooks/useUser";
import { useFileUpload } from "hooks/useFileUpload";
import { UPDATE_SETTINGS } from "lib/mutations/UPDATE_SETTINGS";
import { SETTINGS } from "lib/queries/SETTINGS";

const RegisterContext = createContext<RegisterContextValue>({
  next: () => {},
  prev: () => {},
});

export function useRegisterContext() {
  return useContext(RegisterContext);
}

const MotionCard = motion(Card);

export function RegisterPage() {
  const user = useUser();
  const router = useRouter();
  const handleFileUpload = useFileUpload();
  const [updateSettings] = useMutation(UPDATE_SETTINGS, {
    refetchQueries: [SETTINGS],
  });

  const [variant, setVariant] = useState<Variant>("slideRight");
  const [step, setStep] = useState(0);

  const methods = useForm<FormData>({
    shouldUnregister: false,
    resolver: zodResolver(schema[step]),
    defaultValues: {
      email: "",
      password: "",

      name: "",
      photoUrl: "",
      address: "",
      city: "",
      code: "",
      country: "",

      start: 7,
      end: 16,
      days: [0, 1, 2, 3, 4],
    },
  });

  const next = useCallback(() => {
    setStep((curr) => curr + 1);
    setVariant("slideLeft");
  }, []);

  const prev = useCallback(() => {
    setStep((curr) => curr - 1);
    setVariant("slideRight");
  }, []);

  useEffect(() => {
    methods.trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const onValid = async ({
    email,
    password,

    photoUrl,
    name,
    address,
    city,
    code,
    country,

    start,
    days,
    end,
  }: FormData) => {
    await user.register({
      variables: {
        credentials: {
          email,
          password,
        },
      },
      onCompleted: () => {
        return;
      },
    });

    await Promise.allSettled([
      new Promise<void>(async (resolve, reject) => {
        try {
          if (photoUrl && !photoUrl.startsWith("https")) {
            const file = await fetch(photoUrl)
              .then((res) => res.blob())
              .then(
                (blob) =>
                  new File([blob], name, {
                    type: blob.type,
                    lastModified: new Date().getTime(),
                  }),
              );

            const uploadedPhotoUrl = await handleFileUpload(file);

            await user.update({
              variables: {
                updateUserProfileArgs: {
                  photoUrl: uploadedPhotoUrl,
                  name,
                  address,
                  city,
                  code,
                  country,
                },
              },
            });
          } else {
            await user.update({
              variables: {
                updateUserProfileArgs: {
                  photoUrl,
                  name,
                  address,
                  city,
                  code,
                  country,
                },
              },
            });
          }

          resolve();
        } catch (error: unknown) {
          reject();
        }
      }),
      updateSettings({
        variables: {
          updateSettingsInput: {
            start,
            end,
            days,
          },
        },
      }),
    ]);

    router.push("/");
  };

  return (
    <>
      <Form
        onSubmit={methods.handleSubmit(onValid, console.error)}
        className="flex flex-row"
      >
        <RegisterContext.Provider value={{ next, prev }}>
          {steps.map((s, i) => (
            <FormProvider key={s.value} {...methods}>
              <MotionCard
                className="flex flex-col gap-6 w-full border border-gray-200"
                variants={variants}
                transition={{
                  bounce: 0,
                }}
                initial={variant === "slideLeft" ? "slideLeft" : "slideRight"}
                exit={variant === "slideLeft" ? "slideRight" : "slideLeft"}
                animate={
                  step === i ? { opacity: 1, x: 0 } : { display: "none" }
                }
              >
                <Heading
                  className="pb-4 border-b border-gray-100"
                  title={s.title}
                  description={s?.description}
                />
                {s.content}
              </MotionCard>
            </FormProvider>
          ))}
        </RegisterContext.Provider>
      </Form>

      <ul className="mt-8 flex items-center justify-center space-x-5">
        {steps.map((s, i) => {
          const isCurrent = i === step;
          const isComplete = step > i;

          if (isComplete) {
            return (
              <li
                key={s.value}
                className="block h-2.5 w-2.5 rounded-full bg-orange-600 hover:bg-orange-900"
              >
                <span className="sr-only">{s.title}</span>
              </li>
            );
          }

          if (isCurrent) {
            return (
              <li
                key={s.value}
                className="relative flex items-center justify-center"
              >
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-orange-200" />
                </span>
                <span
                  className="relative block h-2.5 w-2.5 rounded-full bg-orange-600"
                  aria-hidden="true"
                />
                <span className="sr-only">{s.title}</span>
              </li>
            );
          }

          return (
            <li
              key={s.value}
              className="block h-2.5 w-2.5 rounded-full bg-gray-200"
            >
              <span className="sr-only">{s.title}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already have an account?
        <Link
          href="/login"
          className="font-semibold leading-6 ml-1 text-orange-500 hover:text-orange-400"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}

RegisterPage.getLayout = (page: ReactElement) => (
  <CenteredLayout title="Let's get you setup">{page}</CenteredLayout>
);
