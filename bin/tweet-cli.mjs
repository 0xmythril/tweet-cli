#!/usr/bin/env node

import { program } from "commander";
import { createClient, parseTweetId, tweetUrl } from "../lib/client.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf8")
);

program
  .name("tweet-cli")
  .description("A lightweight CLI for posting to X/Twitter using the official API v2.")
  .version(pkg.version);

// ─── whoami ──────────────────────────────────────────────────

program
  .command("whoami")
  .description("Verify credentials and show the authenticated user.")
  .action(async () => {
    try {
      const client = createClient();
      const me = await client.v2.me({
        "user.fields": ["username", "name", "id", "public_metrics"],
      });
      const u = me.data;
      console.log(`@${u.username} (${u.name})`);
      console.log(`  ID: ${u.id}`);
      if (u.public_metrics) {
        console.log(
          `  Followers: ${u.public_metrics.followers_count} | Following: ${u.public_metrics.following_count} | Tweets: ${u.public_metrics.tweet_count}`
        );
      }
    } catch (err) {
      handleError(err);
    }
  });

// ─── post ────────────────────────────────────────────────────

program
  .command("post <text>")
  .description("Post a new tweet.")
  .action(async (text) => {
    try {
      if (!text.trim()) {
        throw new Error("Tweet text cannot be empty.");
      }
      const client = createClient();
      const me = await client.v2.me();
      const result = await client.v2.tweet(text);
      const url = tweetUrl(me.data.username, result.data.id);
      console.log(`Posted: ${url}`);
    } catch (err) {
      handleError(err);
    }
  });

// ─── reply ───────────────────────────────────────────────────

program
  .command("reply <tweetIdOrUrl> <text>")
  .description("Reply to a tweet.")
  .action(async (tweetIdOrUrl, text) => {
    try {
      if (!text.trim()) {
        throw new Error("Reply text cannot be empty.");
      }
      const replyToId = parseTweetId(tweetIdOrUrl);
      const client = createClient();
      const me = await client.v2.me();
      const result = await client.v2.reply(text, replyToId);
      const url = tweetUrl(me.data.username, result.data.id);
      console.log(`Replied: ${url}`);
    } catch (err) {
      handleError(err);
    }
  });

// ─── quote ───────────────────────────────────────────────────

program
  .command("quote <tweetIdOrUrl> <text>")
  .description("Quote a tweet.")
  .action(async (tweetIdOrUrl, text) => {
    try {
      if (!text.trim()) {
        throw new Error("Quote text cannot be empty.");
      }
      const quotedId = parseTweetId(tweetIdOrUrl);
      const client = createClient();
      const me = await client.v2.me();
      const result = await client.v2.tweet({
        text,
        quote_tweet_id: quotedId,
      });
      const url = tweetUrl(me.data.username, result.data.id);
      console.log(`Quoted: ${url}`);
    } catch (err) {
      handleError(err);
    }
  });

// ─── delete ──────────────────────────────────────────────────

program
  .command("delete <tweetIdOrUrl>")
  .description("Delete a tweet.")
  .action(async (tweetIdOrUrl) => {
    try {
      const tweetId = parseTweetId(tweetIdOrUrl);
      const client = createClient();
      const result = await client.v2.deleteTweet(tweetId);
      if (result.data?.deleted) {
        console.log(`Deleted: ${tweetId}`);
      } else {
        console.error(`Failed to delete tweet ${tweetId}.`);
        process.exit(1);
      }
    } catch (err) {
      handleError(err);
    }
  });

// ─── error handling ──────────────────────────────────────────

function handleError(err) {
  // twitter-api-v2 wraps API errors with useful details
  if (err.data) {
    const status = err.code ?? err.statusCode ?? "unknown";
    const title = err.data?.title ?? err.data?.reason ?? "";
    const detail = err.data?.detail ?? "";
    const errors = err.data?.errors ?? err.errors ?? [];
    const messages = errors.map((e) => e.message || e.detail).filter(Boolean);

    console.error(`Error (HTTP ${status}): ${title || err.message}`);
    if (detail) console.error(`  Detail: ${detail}`);
    if (messages.length) console.error(`  ${messages.join("; ")}`);

    // Common fix hints
    if (status === 403) {
      console.error(
        `\nHint: 403 usually means your app permissions are "Read" only.\n` +
          `Go to the X Developer Portal, set permissions to "Read and write",\n` +
          `then regenerate your Access Token and Secret.`
      );
    }
    if (err.rateLimit) {
      const reset = new Date(err.rateLimit.reset * 1000).toISOString();
      console.error(`Rate limited. Resets at: ${reset}`);
    }
  } else {
    console.error(`Error: ${err.message}`);
  }
  process.exit(1);
}

program.parse();
