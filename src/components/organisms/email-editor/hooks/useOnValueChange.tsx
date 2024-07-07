import { ConvexProvider } from "convex/react";
import { Descendant } from "slate";
import debounce from "debounce-promise";
import { render } from "@react-email/render";
import { Font } from "@react-email/font";
import { Head, Html } from "../components";
import { EmailEditor } from "..";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useFileUpload } from "hooks/useFileUpload";
import { convex } from "lib/external/convex";
import { useMutation } from "lib/hooks/useMutation";

type OnValueChangeOptions = { autoSave?: boolean };
type OnValueChangeArgs = [id: Id<"emails">, options?: OnValueChangeOptions];

export function useOnValueChange(
  ...[id, { autoSave = true } = {}]: OnValueChangeArgs
) {
  const updateEmail = useMutation(api.emails.update);
  const uploadEmail = useFileUpload();

  return debounce(async (body: Descendant[]) => {
    console.log("root onValueChange", body);

    if (autoSave) {
      try {
        const email = await updateEmail({ id, body });

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

        const file = new File([html], `${email.title || "email"}.html`, {
          type: "text/html",
        });

        const { storageId } = await uploadEmail(file);
        await updateEmail({ id, html: storageId });
      } catch (e) {
        console.error(e);
      }
    }
  }, 250);
}
