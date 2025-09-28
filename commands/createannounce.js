const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField, InteractionType } = require('discord.js');

const drafts = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createannounce')
    .setDescription('Start a new advanced embed announcement (admin only)'),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }

    // Modal 1: Main content+embed fields (content, title, desc, color, url)
    const modal = new ModalBuilder()
      .setCustomId('announce_main')
      .setTitle('Create Announcement');

    const content = new TextInputBuilder()
      .setCustomId('content')
      .setLabel('Content message (above embed, optional)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(2000);

    const title = new TextInputBuilder()
      .setCustomId('title')
      .setLabel('Embed Title')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(256);

    const description = new TextInputBuilder()
      .setCustomId('description')
      .setLabel('Embed Description')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(4000);

    const color = new TextInputBuilder()
      .setCustomId('color')
      .setLabel('Embed Color (hex, e.g. #58b9ff)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(7);

    const url = new TextInputBuilder()
      .setCustomId('url')
      .setLabel('Embed URL (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(512);

    modal.addComponents(
      new ActionRowBuilder().addComponents(content),
      new ActionRowBuilder().addComponents(title),
      new ActionRowBuilder().addComponents(description),
      new ActionRowBuilder().addComponents(color),
      new ActionRowBuilder().addComponents(url)
    );

    await interaction.showModal(modal);

    // Modal handler
    const submitted = await interaction.awaitModalSubmit({
      time: 10 * 60 * 1000,
      filter: i => i.customId === 'announce_main' && i.user.id === interaction.user.id
    }).catch(() => null);

    if (!submitted) return;

    // Save main fields
    const draft = {
      content: submitted.fields.getTextInputValue('content') || '',
      embed: {
        title: submitted.fields.getTextInputValue('title') || '',
        description: submitted.fields.getTextInputValue('description') || '',
        color: submitted.fields.getTextInputValue('color') || '',
        url: submitted.fields.getTextInputValue('url') || '',
      }
    };

    // Modal 2: Author, footer, images, thumb, timestamp, fields
    const modal2 = new ModalBuilder()
      .setCustomId('announce_advanced')
      .setTitle('Embed Advanced Options');

    const author = new TextInputBuilder()
      .setCustomId('author')
      .setLabel('Author Name (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(256);

    const authorIcon = new TextInputBuilder()
      .setCustomId('authoricon')
      .setLabel('Author Icon URL (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(512);

    const authorUrl = new TextInputBuilder()
      .setCustomId('authorurl')
      .setLabel('Author URL (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(512);

    const footer = new TextInputBuilder()
      .setCustomId('footer')
      .setLabel('Footer Text (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(2048);

    const footerIcon = new TextInputBuilder()
      .setCustomId('footericon')
      .setLabel('Footer Icon URL (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(512);

    modal2.addComponents(
      new ActionRowBuilder().addComponents(author),
      new ActionRowBuilder().addComponents(authorIcon),
      new ActionRowBuilder().addComponents(authorUrl),
      new ActionRowBuilder().addComponents(footer),
      new ActionRowBuilder().addComponents(footerIcon)
    );

    await submitted.showModal(modal2);

    const submitted2 = await submitted.awaitModalSubmit({
      time: 10 * 60 * 1000,
      filter: i => i.customId === 'announce_advanced' && i.user.id === interaction.user.id
    }).catch(() => null);

    if (!submitted2) return;

    draft.embed.author = {
      name: submitted2.fields.getTextInputValue('author') || undefined,
      iconURL: submitted2.fields.getTextInputValue('authoricon') || undefined,
      url: submitted2.fields.getTextInputValue('authorurl') || undefined,
    };
    draft.embed.footer = {
      text: submitted2.fields.getTextInputValue('footer') || undefined,
      iconURL: submitted2.fields.getTextInputValue('footericon') || undefined,
    };

    // Modal 3: Images, thumbnail, timestamp, fields
    const modal3 = new ModalBuilder()
      .setCustomId('announce_imagesfields')
      .setTitle('Images, Fields, Timestamp');

    const image = new TextInputBuilder()
      .setCustomId('image')
      .setLabel('Embed Image URL (header image)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(512);

    const thumb = new TextInputBuilder()
      .setCustomId('thumb')
      .setLabel('Thumbnail URL (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(512);

    const timestamp = new TextInputBuilder()
      .setCustomId('timestamp')
      .setLabel('Timestamp? (yes/no)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(3);

    const fields = new TextInputBuilder()
      .setCustomId('fields')
      .setLabel('Fields: name|value|inline (one per line)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setPlaceholder('Example:\nField1|Value1|true\nField2|Value2|false');

    modal3.addComponents(
      new ActionRowBuilder().addComponents(image),
      new ActionRowBuilder().addComponents(thumb),
      new ActionRowBuilder().addComponents(timestamp),
      new ActionRowBuilder().addComponents(fields)
    );

    await submitted2.showModal(modal3);

    const submitted3 = await submitted2.awaitModalSubmit({
      time: 10 * 60 * 1000,
      filter: i => i.customId === 'announce_imagesfields' && i.user.id === interaction.user.id
    }).catch(() => null);

    if (!submitted3) return;

    draft.embed.image = { url: submitted3.fields.getTextInputValue('image') || undefined };
    draft.embed.thumbnail = { url: submitted3.fields.getTextInputValue('thumb') || undefined };
    draft.embed.timestamp = (submitted3.fields.getTextInputValue('timestamp')?.toLowerCase().startsWith('y')) ? new Date() : undefined;

    // Parse fields
    const fieldsRaw = submitted3.fields.getTextInputValue('fields') || '';
    if (fieldsRaw.trim()) {
      draft.embed.fields = fieldsRaw.split('\n').map(line => {
        const [name, value, inline] = line.split('|');
        return {
          name: name?.trim() || '\u200B',
          value: value?.trim() || '\u200B',
          inline: inline?.trim().toLowerCase() === 'true'
        };
      });
    }

    // Save draft
    drafts.set(interaction.user.id, draft);
    await submitted3.reply({ content: 'Announcement draft saved! Use /previewannounce to view or /uploadannounce to send.', ephemeral: true });
  },
  drafts // export for other commands
};
