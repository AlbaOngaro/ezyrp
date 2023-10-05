import React from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";

type Props = {
  id: string;
  emitted: string;
  due: string;
};

function NewInvoice({ id = "asdf", emitted = "asdf", due = "asdf" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Here's your last invoice</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src="https://res.cloudinary.com/dlha07ue9/image/upload/f_auto,q_auto/v1/assets/logo"
              width="120"
              alt="Nimblerp"
            />
          </Section>

          <Heading style={h1}>Here's your last invoice</Heading>

          <Hr style={hr} />

          <Section
            style={{
              marginTop: "24px",
            }}
          >
            <Row>
              <Column style={{ width: "33%" }}>
                <Heading as="h3">Invoice Id</Heading>
                <Text>{id}</Text>
              </Column>
              <Column style={{ width: "33%" }}>
                <Heading as="h3">Date</Heading>
                <Text>{emitted}</Text>
              </Column>
              <Column style={{ width: "33%" }}>
                <Heading as="h3">Due Date</Heading>
                <Text>{due}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Section
            style={{
              marginTop: "24px",
              marginBottom: "32px",
            }}
          >
            <Button style={button}>Download invoice</Button>
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

export default NewInvoice;

export { NewInvoice };

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
