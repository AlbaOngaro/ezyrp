import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useMemo, useState } from "react";
import { NextPage } from "next";
import { ApolloProvider } from "@apollo/client";
import { Provider, Viewport } from "@radix-ui/react-toast";

import { NetworkError } from "@apollo/client/errors";
import { GraphQLError } from "graphql";

import "styles/globals.css";

import { getClient } from "../lib/apollo/client";

import { Toast } from "../components/atoms/toast/Toast";
import { PushProvider } from "components/providers/push/PushProvider";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function isGraphlError(
  error: GraphQLError | NetworkError,
): error is GraphQLError {
  return error instanceof GraphQLError;
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [errors, setErrors] = useState<(GraphQLError | NetworkError)[]>([]);

  const client = useMemo(
    () =>
      getClient((error) =>
        setErrors((curr) => {
          if (Array.isArray(error)) {
            return [...curr, ...error];
          }

          return [...curr, error];
        }),
      ),
    [],
  );

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider swipeDirection="right" duration={Infinity}>
      <ApolloProvider client={client}>
        <PushProvider>{getLayout(<Component {...pageProps} />)}</PushProvider>
      </ApolloProvider>

      {errors.map((error, idx) => {
        const key = btoa(JSON.stringify(error) + idx);

        if (isGraphlError(error)) {
          return (
            <Toast
              key={key}
              onClose={() =>
                setErrors((curr) =>
                  curr.filter((e, i) => btoa(JSON.stringify(e) + i) !== key),
                )
              }
              title="Graphql Error"
              description={error.message}
              variant="error"
            />
          );
        }

        return (
          <Toast
            key={key}
            onClose={() =>
              setErrors((curr) =>
                curr.filter((e, i) => btoa(JSON.stringify(e) + i) !== key),
              )
            }
            title="Network Error"
            description={error?.message || "Network error, retry in a minute"}
            variant="error"
          />
        );
      })}
      <Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Provider>
  );
}
