# La Sombra Roja Discord Bot

## Railway deployment

This bot is ready to run on Railway as a worker.

### Required environment variables

- `DISCORD_TOKEN` — your bot token
- `GUILD_ID` — the server ID for command registration
- `CLIENT_ID` — optional, only needed if automatic command registration fails

### Deploy on Railway

1. Push this repository to a Git provider connected to Railway.
2. Create a Railway project and choose the `Node.js` template.
3. Add the environment variables under `Variables`.
4. Set the service to use the `Procfile` from the repo.
5. Start the service.

### Register slash commands

Before or after deployment, run locally:

```bash
npm run deploy
```

This will register `/infraction`, `/promote`, and `/assign` in your server.

### Custom embed images

If you want rich bottom images in the embeds, add the following files to an `assets/` folder in the project root:

- `assets/infraction.png`
- `assets/promotion.png`
- `assets/assignment.png`

When those files exist, the bot will attach them automatically.

### Notes

- This bot runs as a worker process, not a web app.
- Keep `DISCORD_TOKEN` private and do not commit it to Git.
