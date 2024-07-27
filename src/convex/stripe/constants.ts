import Stripe from "stripe";

export const client = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const PRICES = {
  free: process.env.FREE_PLAN_PRICE_ID,
  pro: process.env.PRO_PLAN_PRICE_ID,
};
