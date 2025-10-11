const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// Replace with your Discord ID
const OWNER_ID = '1238139423678402600';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a custom message to a chosen channel')
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel where to send the message')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),

  // Slash command version
  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: 'Only the bot owner can use this command.', ephemeral: true });
    }

    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');

    if (!channel.isTextBased()) {
      return interaction.reply({ content: 'That must be a text-based channel.', ephemeral: true });
    }

    await channel.send(message);
    return interaction.reply({ content: `✅ Message sent to ${channel}`, ephemeral: true });
  },

  // Prefix command version
  async executePrefix(message, args) {
    if (message.author.id !== OWNER_ID) {
      return message.reply('Only the bot owner can use this command.');
    }

    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply('Please mention a channel first.\nExample: `p!say #general Hello world!`');
    }

    const msg = args.slice(1).join(' ');
    if (!msg) {
      return message.reply('Please provide a message to send.');
    }

    await channel.send(msg);
    return message.react('✅');
  }
};
