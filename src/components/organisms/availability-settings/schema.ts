import { areIntervalsOverlapping } from "date-fns";
import { z } from "zod";

const interval = z
  .object({
    start: z.string(),
    end: z.string(),
  })
  .refine(
    ({ start, end }) =>
      new Date(`1970-01-01T${start}`).getTime() <
      new Date(`1970-01-01T${end}`).getTime(),
    {
      message: "End time must be greater than start time",
    },
  );

const day = z
  .array(interval)
  .optional()
  .superRefine((val = [], ctx) => {
    val
      .flatMap((a, i) =>
        val
          .filter(
            (b, j) =>
              j !== i &&
              areIntervalsOverlapping(
                {
                  start: new Date(`1970-01-01T${a.start}`),
                  end: new Date(`1970-01-01T${a.end}`),
                },
                {
                  start: new Date(`1970-01-01T${b.start}`),
                  end: new Date(`1970-01-01T${b.end}`),
                },
              ),
          )
          .flatMap((_, j) => [i, j]),
      )
      .reduce<number[]>((acc, curr) => {
        if (acc.includes(curr)) {
          return acc;
        }

        return [...acc, curr];
      }, [])
      .forEach((index) => {
        ctx.addIssue({
          path: [index],
          code: z.ZodIssueCode.custom,
          message: `Intervals are overlapping.`,
        });
      });
  });

export const schema = z.object({
  days: z.object({
    monday: day,
    tuesday: day,
    wednesday: day,
    thursday: day,
    friday: day,
    saturday: day,
    sunday: day,
  }),
});

export type Settings = z.infer<typeof schema>;
