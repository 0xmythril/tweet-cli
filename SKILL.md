---
name: tweet-cli
description: Post tweets, replies, and quotes to X/Twitter using the official API v2. Use this instead of bird for posting. Uses API credits so only post when explicitly asked or scheduled.
homepage: https://github.com/0xmythril/tweet-cli
metadata: {"openclaw":{"emoji":"📮","requires":{"bins":["tweet-cli"]},"install":[{"id":"npm","kind":"shell","command":"npm install -g github:0xmythril/tweet-cli","bins":["tweet-cli"],"label":"Install tweet-cli (npm)"}]}}
---

# tweet-cli

Post to X/Twitter using the official API v2. This tool uses API credits (limited to 1,500 posts/month on the Free tier), so **only use it when the user explicitly asks you to post, or during scheduled cron tasks**. Do not speculatively draft and post tweets.

For **reading** tweets, searching, and browsing timelines, use `bird` instead (no credit cost).

## Setup

1. Install: `npm install -g github:0xmythril/tweet-cli`
2. Get API keys from https://developer.x.com/en/portal/dashboard (Free tier works)
3. Configure credentials:
```bash
mkdir -p ~/.config/tweet-cli
cat > ~/.config/tweet-cli/.env << 'EOF'
X_API_KEY=your_consumer_key
X_API_SECRET=your_secret_key
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
EOF
```
4. Verify: `tweet-cli whoami`

## Commands

### Verify auth
```bash
tweet-cli whoami
```

### Post a tweet
```bash
tweet-cli post "Your tweet text here"
```

### Reply to a tweet
```bash
tweet-cli reply <tweet-id-or-url> "Your reply text"
tweet-cli reply https://x.com/user/status/123456 "Your reply text"
```

### Quote a tweet
```bash
tweet-cli quote <tweet-id-or-url> "Your commentary"
tweet-cli quote https://x.com/user/status/123456 "Your commentary"
```

### Delete a tweet
```bash
tweet-cli delete <tweet-id-or-url>
```

## Important rules

- **Do NOT post unless the user explicitly asks or a cron job triggers it.** Each post uses API credits.
- **Always confirm with the user** before posting, replying, or quoting. Show them the text first.
- For reading tweets, searching, or viewing timelines, use `bird` (not tweet-cli).
- tweet-cli accepts both raw tweet IDs and full URLs (x.com or twitter.com).
- If you get a 402 CreditsDepleted error, inform the user their monthly credits are exhausted.
