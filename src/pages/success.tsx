import { useEffect } from "react";
import { useOrganization } from "@clerk/clerk-react";

import { Check } from "lucide-react";
import { Container } from "components/atoms/container";
import { Card } from "components/atoms/card";
import { H4, Paragraph } from "components/atoms/typography";

export default function SuccessPage() {
  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    if (isLoaded && organization) {
      // Force session refresh
      window.location.assign("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, organization]);

  return (
    <Container className="flex justify-center items-center w-screen h-screen">
      <Card className="p-4 flex flex-col justify-center">
        <span className="bg-green-500 mx-auto p-4 w-14 h-14 text-white inline-flex justify-center items-center rounded-full">
          <Check className="w-10 h-10" />
        </span>

        <H4 className="text-center mt-4">Success!</H4>

        <Paragraph className="text-center">
          You&lquot;ll be redirected to your workspace shortly.
        </Paragraph>
      </Card>
    </Container>
  );
}
