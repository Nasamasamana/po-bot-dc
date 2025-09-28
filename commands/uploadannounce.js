const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const createAnnounce = require('./createannounce.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uploadannounce')
    .setDescription('Send your announcement to a channel (admin only)')
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send to').setRequired(true)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const draft = createAnnounce.drafts.get(interaction.user.id);
    if (!draft) return interaction.reply({ content: 'No draft found. Use /createannounce first.', ephemeral: true });
    const channel = interaction.options.getChannel('channel');
    if (!channel.isTextBased()) return interaction.reply({ content: 'Must be a text channel.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle(draft.title).setDescription(draft.content).setColor(0x00ffcc);
    await channel.send({ embeds: [embed] });
    createAnnounce.drafts.delete(interaction.user.id);
    interaction.reply({ content: 'Announcement sent and draft cleared!', ephemeral: true });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need Administrator permission.');
    }
    const draft = createAnnounce.drafts.get(message.author.id);
    if (!draft) return message.reply('No draft found. Use p!createannounce first.');
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply('Mention a channel.');
    const embed = { title: draft.title, description: draft.content, color: 0x00ffcc };
    await channel.send({ embeds: [embed] });
    createAnnounce.drafts.delete(message.author.id);
    message.reply('Announcement sent and draft cleared!');
  }
};
