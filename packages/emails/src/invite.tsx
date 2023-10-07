import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";

type Props = {
  workspace: string;
  invitee: string;
  inviter: string;
};

function Invite({
  workspace = "workspace:9pmrxmk929drrsjlevd8",
  invitee = "Amina",
  inviter = "Alba",
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to a workspace!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://res.cloudinary.com/dlha07ue9/image/upload/f_auto,q_auto/v1/assets/logo"
              width="120"
              alt="Nimblerp"
            />
          </Section>

          <Heading style={h1}>You've been invited to a workspace!</Heading>

          <Text>
            Hello {invitee}, <strong>{inviter}</strong> has invited you to their
            team on Nimblerp.
          </Text>

          <Hr style={hr} />

          <Section
            style={{
              marginTop: "24px",
              marginBottom: "32px",
            }}
          >
            <Button
              href={`http://localhost:3000/register?workspace=${workspace}`}
              style={button}
            >
              Join the team
            </Button>
          </Section>

          <Section>
            <Text style={footerText}>
              <strong>Alba Ongaro</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const hr = {
  borderStyle: "dashed",
  borderColor: "#E5E5E5",
};

const button = {
  width: "100%",
  borderRadius: "4px",
  backgroundColor: "#FF914D",
  color: "white",
  paddingTop: "12px",
  paddingBottom: "12px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

export default Invite;

export { Invite };
