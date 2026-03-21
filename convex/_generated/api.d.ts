/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions from "../actions.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as badges from "../badges.js";
import type * as calls from "../calls.js";
import type * as crons from "../crons.js";
import type * as files from "../files.js";
import type * as gamification from "../gamification.js";
import type * as http from "../http.js";
import type * as matchmaking from "../matchmaking.js";
import type * as messages from "../messages.js";
import type * as minigames from "../minigames.js";
import type * as moderation from "../moderation.js";
import type * as notifications from "../notifications.js";
import type * as rooms from "../rooms.js";
import type * as seed from "../seed.js";
import type * as storage from "../storage.js";
import type * as trivia from "../trivia.js";
import type * as users from "../users.js";
import type * as webrtc from "../webrtc.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  actions: typeof actions;
  admin: typeof admin;
  auth: typeof auth;
  badges: typeof badges;
  calls: typeof calls;
  crons: typeof crons;
  files: typeof files;
  gamification: typeof gamification;
  http: typeof http;
  matchmaking: typeof matchmaking;
  messages: typeof messages;
  minigames: typeof minigames;
  moderation: typeof moderation;
  notifications: typeof notifications;
  rooms: typeof rooms;
  seed: typeof seed;
  storage: typeof storage;
  trivia: typeof trivia;
  users: typeof users;
  webrtc: typeof webrtc;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
