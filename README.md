# po-bot-dc

Java Discord bot starter for Render.com deployment with support for both prefix (p!) and slash (/) commands, modular command structure, and announcement embeds with temporary per-user storage.

## Features
- Both slash and prefix commands ("p!" and "/")
- Modular command folder for easy extension
- Announcement embed system with preview/edit/upload and per-user temporary storage (admin only)
- Permissions checks for all commands
- Render.com deploy ready (Procfile, Maven, no local setup required)
- 24/7 uptime with HTTP endpoint for UptimeRobot.com

## Quick Start
1. Connect this repo to Render.com as a new Web Service.
2. Set environment variable `DISCORD_TOKEN` with your bot token.
3. Build command: `mvn clean package`
4. Start command: `java -jar target/po-bot-dc-1.0-SNAPSHOT-jar-with-dependencies.jar`
5. Set up UptimeRobot to ping `https://<your-render-url>/` every 5 minutes for 24/7 uptime.

## Commands
- `/say` or `p!say` — Send a message to a mentioned channel (admin only)
- `/lock` or `p!lock` — Lock a channel (manage channel perm required)
- `/unlock` or `p!unlock` — Unlock a channel (manage channel perm required)
- `/purgeuser` or `p!purgeuser` — Delete all messages from a user (manage messages perm required)
- `/createannounce`, `/previewannounce`, `/uploadannounce` — Create and manage custom embed announcements (admin only, with preview, edit, confirm, upload, temp storage)
- `/help` — Show all commands in paged embed

---
See the code in the `src/main/java/bot/` and `src/main/java/bot/commands/` directories for implementation details.
