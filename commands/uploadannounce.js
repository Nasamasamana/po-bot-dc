const { SlashCommandBuilder, ChannelType, PermissionsBitField, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType } = require('discord.js');
const createAnnounce = require('./createannounce.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uploadannounce')
    .setDescription('Send your announcement to a channel (admin only)'),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const draft = createAnnounce.drafts.get(interaction.user.id);

    if (!draft) {
      return interaction.reply({ content: 'No draft found. Use /createannounce first.', ephemeral: true });
    }

    // Channel picker
    const textChannels = interaction.guild.channels.cache
      .filter(ch => ch.type === ChannelType.GuildText && ch.viewable && ch.permissionsFor(interaction.member).has(PermissionsBitField.Flags.SendMessages))
      .map(ch => ({
        label: ch.name,
        value: ch.id
      }));

    if (!textChannels.length) {
      return interaction.reply({ content: 'No text channels to send to!', ephemeral: true });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_channel')
      .setPlaceholder('Pick a channel to send the announcement')
      .addOptions(textChannels.slice(0, 25)); // Max 25 options

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ content: 'Select a channel to send your announcement:', components: [row], ephemeral: true });

    const select = await interaction.channel.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      filter: i => i.user.id === interaction.user.id && i.customId === 'select_channel',
      time: 60 * 1000
    }).catch(() => null);

    if (!select) return interaction.editReply({ content: 'No channel selected.', components: [] });

    const channel = interaction.guild.channels.cache.get(select.values[0]);
    if (!channel) return select.reply({ content: 'Channel not found!', ephemeral: true });

    // Build embed
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

    await channel.send({
      content: draft.content || null,
      embeds: [eb]
    });

    await select.reply({ content: `Announcement sent to <#${channel.id}>!`, ephemeral: true });
    createAnnounce.drafts.delete(interaction.user.id);
  }
};
