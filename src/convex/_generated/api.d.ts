/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.12.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions from "../actions.js";
import type * as bookings from "../bookings.js";
import type * as countries from "../countries.js";
import type * as customers from "../customers.js";
import type * as emails from "../emails.js";
import type * as eventTypes from "../eventTypes.js";
import type * as events from "../events.js";
import type * as invoices from "../invoices.js";
import type * as items from "../items.js";
import type * as settings from "../settings.js";
import type * as storage from "../storage.js";
import type * as utils from "../utils.js";
import type * as workflows from "../workflows.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  bookings: typeof bookings;
  countries: typeof countries;
  customers: typeof customers;
  emails: typeof emails;
  eventTypes: typeof eventTypes;
  events: typeof events;
  invoices: typeof invoices;
  items: typeof items;
  settings: typeof settings;
  storage: typeof storage;
  utils: typeof utils;
  workflows: typeof workflows;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
