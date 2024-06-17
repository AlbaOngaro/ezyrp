import { Variants } from "framer-motion";

import { Schedule } from "./steps/Schedule";
import { BaseData } from "./steps/BaseData";
import { Profile } from "./steps/Profile";

export const steps = [
  {
    value: "basedata",
    title: "Credentials",
    description: "The email and password you'll use to access your account",
    content: <BaseData />,
  },
  {
    value: "profile",
    title: "Profile",
    description: "Customise your profile. You can change this at a later time",
    content: <Profile />,
  },
  {
    value: "schedule",
    title: "Schedule",
    description:
      "Define your work schedule. You can change this at a later time.",
    content: <Schedule />,
  },
];

export const variants = {
  slideLeft: {
    opacity: 0,
    x: -100,
  },
  slideRight: {
    opacity: 0,
    x: 100,
  },
} satisfies Variants;
