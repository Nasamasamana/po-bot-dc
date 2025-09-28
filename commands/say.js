const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message to a channel (admin only)')
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send to').setRequired(true))
    .addStringOption(opt => opt.setName('message').setDescription('Message').setRequired(true)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');
    if (!channel.isTextBased()) return interaction.reply({ content: 'Must be a text channel.', ephemeral: true });
    channel.send(message);
    interaction.reply({ content: 'Message sent!', ephemeral: true });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need Administrator permission.');
    }
    const channelMention = args.shift();
    const msg = args.join(' ');
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('Mention a channel.');
    channel.send(msg);
    message.react('✅');
  }
};
