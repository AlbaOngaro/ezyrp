export const initialValue = [
  {
    type: "paragraph" as const,
    children: [{ text: "Hello World" }],
  },
  {
    type: "button" as const,
    children: [{ text: "Hello World" }],
  },
  {
    type: "column" as const,
    children: [
      {
        type: "paragraph" as const,
        children: [{ text: "Hello World" }],
      },
    ],
  },
];
