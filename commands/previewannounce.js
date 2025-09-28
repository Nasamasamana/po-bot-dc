const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const createAnnounce = require('./createannounce.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previewannounce')
    .setDescription('Preview your announcement draft (admin only)'),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const draft = createAnnounce.drafts.get(interaction.user.id);
    if (!draft) return interaction.reply({ content: 'No draft found. Use /createannounce first.', ephemeral: true });
    const embed = new EmbedBuilder().setTitle(draft.title).setDescription(draft.content).setColor(0x00ffcc);
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need Administrator permission.');
    }
    const draft = createAnnounce.drafts.get(message.author.id);
    if (!draft) return message.reply('No draft found. Use p!createannounce first.');
    const embed = { title: draft.title, description: draft.content, color: 0x00ffcc };
    message.reply({ embeds: [embed] });
  }
};
