import { Descendant } from "slate";

export const initialValue: Descendant[] = [
  {
    type: "container",
    style: {
      margin: "0 auto",
      padding: "20px 0 48px",
    },
    children: [
      {
        type: "img",
        src: "https://images.unsplash.com/photo-1718717722247-26f4c6c09192?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        children: [{ text: "" }],
      },
      {
        type: "paragraph",
        style: {
          fontSize: "16px",
          lineHeight: "26px",
        },
        children: [{ text: "Hi There!" }],
      },
      {
        type: "paragraph",
        style: {
          fontSize: "16px",
          lineHeight: "26px",
        },
        children: [
          {
            text: "Welcome to Koala, the sales intelligence platform that helps you uncover qualified leads and close deals faster.",
          },
        ],
      },
      {
        type: "section",
        style: {
          textAlign: "center",
        },
        children: [
          {
            type: "button",
            href: "https://getkoala.com",
            style: {
              backgroundColor: "#5F51E8",
              borderRadius: "3px",
              color: "#fff",
              fontSize: "16px",
              textDecoration: "none",
              textAlign: "center",
              display: "block",
              padding: "12px",
            },
            children: [{ text: "Get Started" }],
          },
        ],
      },
      {
        type: "paragraph",
        style: {
          fontSize: "16px",
          lineHeight: "26px",
        },
        children: [
          { text: "Best," },
          { text: "\n" },
          { text: "The Koala team" },
        ],
      },
      {
        type: "hr",
        style: {
          borderColor: "#cccccc",
          margin: "20px 0",
        },
        children: [{ text: "" }],
      },
      {
        type: "paragraph",
        style: {
          color: "#8898aa",
          fontSize: "12px",
        },
        children: [
          { text: "470 Noor Ave STE B #1148, South San Francisco, CA 94080" },
        ],
      },
    ],
  },
];
