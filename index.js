require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, PermissionsBitField, Events } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Express keep-alive server for Render/UptimeRobot
const app = express();
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`Keep-alive server listening on port ${PORT}`));

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Modular command handling
client.commands = new Collection();
const prefix = 'p!';

// Dynamically load command files from ./commands
const commandsPath = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Register slash commands on ready
client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Register global slash commands if needed:
  try {
    await client.application.commands.set(client.commands.map(cmd => cmd.data.toJSON()));
    console.log('Slash commands registered.');
  } catch (e) {
    console.error('Slash command registration failed:', e);
  }
});

// Slash command handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
  }
});

// Prefix command handler
client.on(Events.MessageCreate, async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;
  try {
    await command.executePrefix(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});

client.login(process.env.DISCORD_TOKEN);
