# tweet-cli

A lightweight Node.js CLI for posting to X/Twitter using the official API v2. No scraping, no cookies, no anti-automation blocks.

Built for use with [OpenClaw](https://github.com/nicepkg/openclaw) and other AI agents that need reliable Twitter posting.

## Features

- Post tweets, replies, quotes, and delete tweets
- Official X API v2 with OAuth 1.0a (no cookie auth, no anti-automation blocks)
- Accepts both tweet URLs and raw IDs
- Clear error messages with actionable fix hints
- Zero-config for OpenClaw (just install and add your API keys)
- Works with the X Free tier (1,500 posts/month)

## Install

```bash
# From GitHub
npm install -g github:0xmythril/tweet-cli

# From source
git clone https://github.com/0xmythril/tweet-cli.git
cd tweet-cli
npm install
npm link
```

**Requirements:** Node.js 18+

## Auth

You need 4 credentials from the [X Developer Portal](https://developer.x.com/en/portal/dashboard):

1. Create an app (or use an existing one)
2. Under **User authentication settings**, set permissions to **Read and write**
3. Generate (or regenerate) your Access Token and Secret

Create `~/.config/tweet-cli/.env`:

```bash
mkdir -p ~/.config/tweet-cli
cp .env.example ~/.config/tweet-cli/.env
# Edit with your keys
```

Required variables:

```
X_API_KEY=your_consumer_key
X_API_SECRET=your_secret_key
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
```

tweet-cli also checks for a `.env` in the current directory and accepts standard environment variables.

## Usage

### Verify auth

```bash
tweet-cli whoami
# @yourname (Your Name)
#   ID: 123456789
#   Followers: 42 | Following: 100 | Tweets: 500
```

### Post a tweet

```bash
tweet-cli post "Hello from tweet-cli!"
# Posted: https://x.com/yourname/status/123456789
```

### Reply to a tweet

```bash
tweet-cli reply 1234567890 "Nice post!"
tweet-cli reply https://x.com/user/status/1234567890 "Nice post!"
# Replied: https://x.com/yourname/status/123456790
```

### Quote a tweet

```bash
tweet-cli quote 1234567890 "This is important"
tweet-cli quote https://x.com/user/status/1234567890 "This is important"
# Quoted: https://x.com/yourname/status/123456791
```

### Delete a tweet

```bash
tweet-cli delete 1234567890
tweet-cli delete https://x.com/user/status/1234567890
# Deleted: 1234567890
```

## URL and ID support

All commands that take a tweet reference accept both formats:

- Raw ID: `1234567890`
- Full URL: `https://x.com/user/status/1234567890`
- Legacy URL: `https://twitter.com/user/status/1234567890`

## Exit codes

- `0` — Success
- `1` — Error (details printed to stderr)

## Error handling

tweet-cli provides clear error messages with hints:

- **403 Forbidden** — App permissions are "Read" only. Set to "Read and write" and regenerate your Access Token.
- **402 CreditsDepleted** — Monthly API credits exhausted. Wait for reset or upgrade your plan.
- **429 Rate Limited** — Shows when the rate limit resets.

## API tier

This tool works with the **Free** tier of the X API (1,500 posts/month). For reading tweets, searching, and mentions, you need the Basic tier ($200/month) or use a complementary tool like [bird](https://github.com/steipete/bird).

## OpenClaw Integration

tweet-cli works as an [OpenClaw](https://github.com/nicepkg/openclaw) skill for AI agents that need to post on X/Twitter.

### Install the skill

Copy the `SKILL.md` file to your OpenClaw workspace skills directory:

```bash
mkdir -p ~/.openclaw/workspace/skills/tweet-cli
cp SKILL.md ~/.openclaw/workspace/skills/tweet-cli/SKILL.md
```

Or install directly from this repo:

```bash
mkdir -p ~/.openclaw/workspace/skills/tweet-cli
curl -o ~/.openclaw/workspace/skills/tweet-cli/SKILL.md \
  https://raw.githubusercontent.com/0xmythril/tweet-cli/main/SKILL.md
```

### How it works with OpenClaw

- **Posting** (tweets, replies, quotes): Uses `tweet-cli` via the official X API v2
- **Reading** (timelines, search, mentions): Use [bird](https://github.com/steipete/bird) (cookie-based, no API credits)

The skill instructs OpenClaw to:
- Only post when explicitly asked by the user or triggered by a cron job
- Always confirm tweet content with the user before posting
- Use `bird` for reading (free, no API credits)
- Report credit depletion errors clearly

### Configure credentials for OpenClaw

Set up `~/.config/tweet-cli/.env` with your API keys (see [Auth](#auth) above). The credentials will be available to OpenClaw when it runs `tweet-cli` commands.

## License

MIT
