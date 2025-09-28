const { SlashCommandBuilder } = require('discord.js');

const helpText =
`**Commands:**
\`/say\` or \`p!say\` — Send a message (admin only)
\`/lock\` or \`p!lock\` — Lock a channel
\`/unlock\` or \`p!unlock\` — Unlock a channel
\`/purgeuser\` or \`p!purgeuser\` — Delete recent messages from a user
\`/createannounce\` — Start an announcement draft (admin only)
\`/previewannounce\` — Preview your announcement embed (admin only)
\`/uploadannounce\` — Publish your announcement (admin only)
\`/help\` — Show this help message
`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all commands'),
  async execute(interaction) {
    interaction.reply({ content: helpText, ephemeral: true });
  },
  async executePrefix(message) {
    message.reply(helpText);
  }
};
