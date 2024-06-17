import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import "styles/globals.css";
import { UserProvider } from "providers/user";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <Head>
        <title>Nimblerp</title>
      </Head>

      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
