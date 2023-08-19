import type { AppProps } from "next/app";
import * as Dialog from "@radix-ui/react-dialog";

import "styles/globals.css";
import { AuthProvider } from "providers/auth/AuthProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Dialog.Root>
        <Component {...pageProps} />
      </Dialog.Root>
    </AuthProvider>
  );
}
