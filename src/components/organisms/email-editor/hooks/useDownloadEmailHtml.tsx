import { ConvexProvider } from "convex/react";
import { useState } from "react";
import { render } from "@react-email/render";
import { Font } from "@react-email/font";

import { EmailEditor } from "..";
import { Head, Html } from "../components";
import { convex } from "lib/external/convex";
import { Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

type DownloadFn = (id: Id<"emails">) => Promise<void>;
type State = {
  loading: boolean;
  error: Error | null;
};

type ReturnTuple = [DownloadFn, State];

export function useDownloadEmailHtml(): ReturnTuple {
  const [getEmail] = useLazyQuery(api.emails.get);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = async (id: Id<"emails">) => {
    try {
      setIsLoading(true);

      console.log("Downloading email", id);

      const email = await getEmail({
        id,
      });

      console.log("Generating email HTML");

      const html = render(
        <ConvexProvider client={convex}>
          <Html>
            <Head>
              <Font
                fontFamily="Roboto"
                fallbackFontFamily="Verdana"
                webFont={{
                  url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                  format: "woff2",
                }}
                fontWeight={400}
                fontStyle="normal"
              />
            </Head>
            <EmailEditor email={email} readOnly />
          </Html>
        </ConvexProvider>,
      );

      const file = new File([html], "email.html", {
        type: "text/html",
      });

      const fr = new FileReader();
      const promise = new Promise<string>((resolve, reject) => {
        fr.onload = () => {
          if (fr.result && typeof fr.result === "string") {
            return resolve(fr.result);
          }

          reject();
        };
      });

      fr.readAsDataURL(file);

      console.log("Getting download URL");

      const href = await promise;

      if (href) {
        var link = document.createElement("a");
        link.href = href;
        link.download = `${id}.html`;
        link.click();
      } else {
        throw new Error("Failed to generate download URL");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return [download, { loading: isLoading, error }];
}
