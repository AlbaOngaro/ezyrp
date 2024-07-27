import { useFormContext } from "react-hook-form";
import { FormValue } from "../types";
import { PRICES } from "../constants";
import { Heading } from "components/atoms/heading";
import { Paragraph } from "components/atoms/typography";
import { CHF } from "lib/formatters/chf";

export function SummaryStep() {
  const { getValues } = useFormContext<FormValue>();

  const name = getValues("name");
  const plan = getValues("plan");

  return (
    <>
      <Heading title="Summary" description="Please confirm your details" />
      <Paragraph>
        <small>Choosen workspace name</small>
        <br />
        <strong>{name}</strong>
        <br />
        <small> Choosen plan:</small>
        <br />
        <strong>
          {plan} ({CHF.format(PRICES[plan])} / month)
        </strong>
      </Paragraph>
    </>
  );
}
