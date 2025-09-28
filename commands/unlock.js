const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock a channel (manage channels required)')
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to unlock').setRequired(false)),
  async execute(interaction, client) {
    const member = interaction.member;
    if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'You need Manage Channels permission.', ephemeral: true });
    }
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    if (!channel.isTextBased()) return interaction.reply({ content: 'Channel must be text-based.', ephemeral: true });
    await channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });
    return interaction.reply({ content: `🔓 ${channel} unlocked!`, ephemeral: false });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('You need Manage Channels permission.');
    }
    const channel = message.mentions.channels.first() || message.channel;
    await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
    message.reply(`🔓 ${channel} unlocked!`);
  }
};
