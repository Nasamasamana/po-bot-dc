const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

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
    // optional: remove this if you don’t want admin-only restriction
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission to use this command.', ephemeral: true });
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
    // optional: remove this if you don’t want admin-only restriction
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need Administrator permission to use this command.');
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
