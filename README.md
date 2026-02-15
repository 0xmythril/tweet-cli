# tweet-cli

A lightweight CLI for posting to X/Twitter using the official API v2. No scraping, no cookies, no anti-automation blocks.

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
```

### Post a tweet

```bash
tweet-cli post "Hello from tweet-cli!"
```

### Reply to a tweet

```bash
tweet-cli reply 1234567890 "Nice post!"
tweet-cli reply https://x.com/user/status/1234567890 "Nice post!"
```

### Quote a tweet

```bash
tweet-cli quote 1234567890 "This is important"
tweet-cli quote https://x.com/user/status/1234567890 "This is important"
```

### Delete a tweet

```bash
tweet-cli delete 1234567890
tweet-cli delete https://x.com/user/status/1234567890
```

## URL and ID support

All commands that take a tweet reference accept both formats:

- Raw ID: `1234567890`
- Full URL: `https://x.com/user/status/1234567890`
- Legacy URL: `https://twitter.com/user/status/1234567890`

## Exit codes

- `0` — Success
- `1` — Error (details printed to stderr)

## API tier

This tool works with the **Free** tier of the X API (1,500 posts/month). For reading tweets, searching, and mentions, you need the Basic tier ($200/month) or use a complementary tool like [bird](https://github.com/steipete/bird).

## License

MIT
