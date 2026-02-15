import { TwitterApi } from "twitter-api-v2";
import { resolve, join } from "node:path";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import dotenv from "dotenv";

const REQUIRED_VARS = [
  "X_API_KEY",
  "X_API_SECRET",
  "X_ACCESS_TOKEN",
  "X_ACCESS_TOKEN_SECRET",
];

/**
 * Load credentials from (in order):
 * 1. ~/.config/tweet-cli/.env
 * 2. .env in current directory
 * 3. Environment variables (already set)
 */
function loadEnv() {
  const configPath = join(homedir(), ".config", "tweet-cli", ".env");
  if (existsSync(configPath)) {
    dotenv.config({ path: configPath });
  }

  const localPath = resolve(process.cwd(), ".env");
  if (existsSync(localPath)) {
    dotenv.config({ path: localPath });
  }
}

/**
 * Create an authenticated Twitter API client.
 * Throws with a clear message if credentials are missing.
 */
export function createClient() {
  loadEnv();

  const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `Missing credentials: ${missing.join(", ")}\n` +
        `Set them in ~/.config/tweet-cli/.env or as environment variables.\n` +
        `See: tweet-cli --help`
    );
  }

  return new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });
}

/**
 * Extract a tweet ID from a URL or raw ID string.
 * Accepts:
 *   - https://x.com/user/status/123456
 *   - https://twitter.com/user/status/123456
 *   - 123456
 */
export function parseTweetId(input) {
  if (!input) {
    throw new Error("Tweet ID or URL is required.");
  }

  const trimmed = input.trim();

  // Raw numeric ID
  if (/^\d+$/.test(trimmed)) {
    return trimmed;
  }

  // URL pattern
  const match = trimmed.match(
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i
  );
  if (match) {
    return match[1];
  }

  throw new Error(
    `Invalid tweet ID or URL: "${trimmed}"\n` +
      `Expected a numeric ID or a URL like https://x.com/user/status/123456`
  );
}

/**
 * Build a tweet URL from a username and tweet ID.
 */
export function tweetUrl(username, tweetId) {
  return `https://x.com/${username}/status/${tweetId}`;
}
