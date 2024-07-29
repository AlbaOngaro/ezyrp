import { PRICES } from "../constants";
import { useOnobardingFormContext } from "../hooks/useOnobardingFormContext";
import { Heading } from "components/atoms/heading";
import { Paragraph } from "components/atoms/typography";
import { CHF } from "lib/formatters/chf";

export function SummaryStep() {
  const { getValues } = useOnobardingFormContext();

  const name = getValues("name");
  const plan = getValues("plan");
  const teamMembers = getValues("teamMembers");

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
        <br />
        <small>Team members:</small>
        <ul>
          {teamMembers.map((teamMember) => (
            <li key={teamMember.email}>{teamMember.email}</li>
          ))}
        </ul>
      </Paragraph>
    </>
  );
}
