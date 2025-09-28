const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// In-memory announcement drafts per user
const drafts = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createannounce')
    .setDescription('Create a new announcement (admin only)')
    .addStringOption(opt => opt.setName('title').setDescription('Title').setRequired(true))
    .addStringOption(opt => opt.setName('content').setDescription('Content').setRequired(true)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const title = interaction.options.getString('title');
    const content = interaction.options.getString('content');
    drafts.set(interaction.user.id, { title, content });
    return interaction.reply({ content: 'Announcement draft saved! Use /previewannounce to preview.', ephemeral: true });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('You need Administrator permission.');
    }
    const title = args.shift();
    const content = args.join(' ');
    if (!title || !content) return message.reply('Usage: p!createannounce <title> <content>');
    drafts.set(message.author.id, { title, content });
    message.reply('Announcement draft saved! Use p!previewannounce to preview.');
  },
  drafts
};
