---
name: tweet-cli
description: Post tweets, replies, quotes, and deletes on X/Twitter through the official API v2. Use when the user explicitly asks to publish content to X or when an approved schedule triggers posting.
homepage: https://github.com/0xmythril/tweet-cli
---

# tweet-cli Skill

Use this skill to publish on X/Twitter with `tweet-cli`.

For reading timelines, search, and mentions, use `bird` instead.

## When agents should use this

- User explicitly asks to post, reply, quote, or delete on X/Twitter
- A scheduled automation explicitly requests publishing

Do **not** use this skill for browsing or research workflows.

## Requirements

1. `tweet-cli` installed and available in `PATH`
2. Credentials configured in `~/.config/tweet-cli/.env`
3. Required environment variables:
   - `X_API_KEY`
   - `X_API_SECRET`
   - `X_ACCESS_TOKEN`
   - `X_ACCESS_TOKEN_SECRET`

## Install

```bash
npm install -g github:0xmythril/tweet-cli#v1.0.0
```

## Agent operating rules

1. Only publish when explicitly instructed by the user (or scheduled task).
2. Before posting/replying/quoting, show exact text and get confirmation.
3. Prefer raw tweet IDs; URLs are also accepted.
4. If command fails, surface stderr and suggested fix.
5. If API returns `402 CreditsDepleted`, clearly report monthly credits are exhausted.

## Command reference

### Verify auth

```bash
tweet-cli whoami
```

### Post

```bash
tweet-cli post "Text to publish"
```

### Reply

```bash
tweet-cli reply <tweet-id-or-url> "Reply text"
```

### Quote

```bash
tweet-cli quote <tweet-id-or-url> "Commentary text"
```

### Delete

```bash
tweet-cli delete <tweet-id-or-url>
```

## Agent workflow (recommended)

1. Determine action (`post`, `reply`, `quote`, `delete`).
2. Draft final text (if applicable).
3. Ask for explicit confirmation.
4. Execute the command.
5. Return result URL/ID or actionable error.

## Examples

```bash
# Post
tweet-cli post "Shipping v1.0.0 today. Feedback welcome."

# Reply with URL
tweet-cli reply https://x.com/user/status/1234567890 "Great write-up."

# Quote with ID
tweet-cli quote 1234567890 "Worth reading for anyone building in public."
```
