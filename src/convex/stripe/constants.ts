import Stripe from "stripe";

export const client = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const PRICES = {
  free: "price_1PgZ6JFCTTTwOs5UzuyteYDt",
  pro: "price_1Pg3fnFCTTTwOs5UnjddiMkg",
};
