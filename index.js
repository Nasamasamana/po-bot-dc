const { Client, GatewayIntentBits } = require('discord.js');

// 1. Initialize the client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// 2. Ready event
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Optional: send a message to a specific channel
    const channelId = 'YOUR_CHANNEL_ID';
    client.channels.fetch(channelId).then(channel => {
        channel.send('Bot is now online and ready!');
    }).catch(console.error);
});

// 3. Log in
client.login(process.env.TOKEN);
