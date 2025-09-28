const createAnnounce = require('./createannounce.js');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editannounce')
    .setDescription('Edit your last announcement draft (admin only)'),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
    }
    const draft = createAnnounce.drafts.get(interaction.user.id);
    if (!draft) {
      return interaction.reply({ content: 'No draft found. Use /createannounce first.', ephemeral: true });
    }
    // Re-run createannounce, but prefill modals if possible (Discord modals don't support prefilled, so just call createannounce)
    require('./createannounce.js').execute(interaction, client);
  }
};
