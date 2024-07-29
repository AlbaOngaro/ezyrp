import * as RadioGroup from "@radix-ui/react-radio-group";
import { Controller } from "react-hook-form";
import { useOnobardingFormContext } from "../hooks/useOnobardingFormContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "components/atoms/accordion";
import { Button } from "components/atoms/button";
import { H3, Paragraph } from "components/atoms/typography";
import { CHF } from "lib/formatters/chf";

export function PlanStep() {
  const { control } = useOnobardingFormContext();

  return (
    <Controller
      control={control}
      name="plan"
      render={({ field: { value, onChange } }) => (
        <RadioGroup.Root
          className="grid gap-2"
          defaultValue={value}
          onValueChange={(value) => onChange(value as "free" | "pro")}
        >
          <Accordion type="single" defaultValue={value}>
            <AccordionItem value="free">
              <AccordionTrigger className="font-semibold">
                Free
              </AccordionTrigger>
              <AccordionContent>
                <H3>{CHF.format(0)} / month</H3>
                <Paragraph className="mb-2">
                  Get started with the basic features:
                  <ul className="list-outside list-disc pl-4">
                    <li className="list-item">Up to 5 team members</li>
                    <li className="list-item">Unlimited customers</li>
                    <li className="list-item">Inventory management</li>
                    <li className="list-item">Invoices management</li>
                    <li className="list-item">Schedule management</li>
                    <li className="list-item">Up to 5 custom event types</li>
                  </ul>
                </Paragraph>
                <RadioGroup.Item value="free" asChild>
                  <Button
                    variant="outline"
                    className="w-full data-[state=checked]:bg-black data-[state=checked]:text-white"
                  >
                    {value === "free" ? "Selected" : "Chose"}
                  </Button>
                </RadioGroup.Item>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pro">
              <AccordionTrigger className="font-semibold">Pro</AccordionTrigger>
              <AccordionContent>
                <H3>{CHF.format(15)} / month</H3>
                <Paragraph className="mb-2">
                  Unlock all the features with the pro plan:
                  <ul className="list-outside list-disc pl-4">
                    <li className="list-item">All free plan features</li>
                    <li className="list-item">Unlimited event types</li>
                    <li className="list-item">Custom email templates</li>
                    <li className="list-item">Custom workflows</li>
                  </ul>
                </Paragraph>
                <RadioGroup.Item value="pro" asChild>
                  <Button
                    variant="outline"
                    className="w-full data-[state=checked]:bg-black data-[state=checked]:text-white"
                  >
                    {value === "pro" ? "Selected" : "Chose"}
                  </Button>
                </RadioGroup.Item>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </RadioGroup.Root>
      )}
    />
  );
}
