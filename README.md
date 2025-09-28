# po-bot-dc (Node.js Edition)

A modular Discord bot for Render.com deployment supporting both prefix ("p!") and slash ("/") commands. Includes an HTTP keep-alive endpoint for 24/7 uptime with UptimeRobot.

## Features

- Slash and prefix commands (p! and /)
- Modular command folder
- Announcement embed preview/upload for admins
- Permissions checks for all commands
- Render.com deploy ready
- HTTP keep-alive endpoint for UptimeRobot

## How to Deploy

1. Fork or clone this repo.
2. On Render.com, create a **Web Service** from this repo.
3. Add environment variable: `DISCORD_TOKEN` (your bot token).
4. Set build command: *(leave blank for Node.js)*
5. Set start command: `node index.js`
6. Set up UptimeRobot to ping: `https://<your-render-url>/` every 5 minutes.

## Commands

- `/say` or `p!say` — Send a message to a channel (admin only)
- `/lock` or `p!lock` — Lock a channel (manage channels required)
- `/unlock` or `p!unlock` — Unlock a channel (manage channels required)
- `/purgeuser` or `p!purgeuser` — Delete recent messages from a user (manage messages required)
- `/createannounce`, `/previewannounce`, `/uploadannounce` — Create/preview/publish announcement (admin only)
- `/help` — Show all commands

---
