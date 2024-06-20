import { Descendant } from "slate";

export const initialValue: Descendant[] = [
  {
    type: "container",
    children: [
      {
        type: "img",
        src: "https://images.unsplash.com/photo-1718717722247-26f4c6c09192?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        children: [{ text: "" }],
      },
      {
        type: "paragraph",
        children: [{ text: "Hi There!" }],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "Welcome to Koala, the sales intelligence platform that helps you uncover qualified leads and close deals faster.",
          },
        ],
      },
      {
        type: "section",
        children: [
          {
            type: "button",
            children: [{ text: "Get Started" }],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          { text: "Best," },
          { text: "\n" },
          { text: "The Koala team" },
        ],
      },
      {
        type: "hr",
        children: [{ text: "" }],
      },
      {
        type: "paragraph",
        children: [
          { text: "470 Noor Ave STE B #1148, South San Francisco, CA 94080" },
        ],
      },
    ],
  },
];
