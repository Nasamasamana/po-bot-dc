const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const createAnnounce = require('./createannounce.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('previewannounce')
    .setDescription('Preview your current announcement draft (admin only)'),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const draft = createAnnounce.drafts.get(interaction.user.id);
    if (!draft) return interaction.reply({ content: 'No draft found. Use /createannounce first.', ephemeral: true });

    // Build the embed
    const eb = new EmbedBuilder()
      .setTitle(draft.embed.title || null)
      .setDescription(draft.embed.description || null)
      .setColor(draft.embed.color ? parseInt(draft.embed.color.replace('#', ''), 16) : null)
      .setURL(draft.embed.url || null);

    if (draft.embed.author?.name) eb.setAuthor({ name: draft.embed.author.name, iconURL: draft.embed.author.iconURL, url: draft.embed.author.url });
    if (draft.embed.footer?.text) eb.setFooter({ text: draft.embed.footer.text, iconURL: draft.embed.footer.iconURL });
    if (draft.embed.image?.url) eb.setImage(draft.embed.image.url);
    if (draft.embed.thumbnail?.url) eb.setThumbnail(draft.embed.thumbnail.url);
    if (draft.embed.timestamp) eb.setTimestamp(new Date(draft.embed.timestamp));
    if (draft.embed.fields?.length) eb.setFields(draft.embed.fields);

    await interaction.reply({
      content: draft.content || null,
      embeds: [eb],
      ephemeral: true
    });
  }
};
