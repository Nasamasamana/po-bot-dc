const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgeuser')
    .setDescription('Delete recent messages from a user (manage messages required)')
    .addUserOption(opt => opt.setName('user').setDescription('User to purge').setRequired(true)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'You don’t have permission to use this command.', ephemeral: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgeuser')
    .setDescription('Delete recent messages from a user (manage messages required)')
    .addUserOption(opt => opt.setName('user').setDescription('User to purge').setRequired(true)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: 'You need Manage Messages permission.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ limit: 100 });
    const filtered = messages.filter(m => m.author.id === user.id);
    await channel.bulkDelete(filtered, true);
    return interaction.reply({ content: `Purged recent messages from ${user}.`, ephemeral: true });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('You need Manage Messages permission.');
    }
    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention a user to purge.');
    const messages = await message.channel.messages.fetch({ limit: 100 });
    const filtered = messages.filter(m => m.author.id === user.id);
    await message.channel.bulkDelete(filtered, true);
    message.reply(`Purged recent messages from ${user}.`);
  }
}; content: 'You need Manage Messages permission.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ limit: 100 });
    const filtered = messages.filter(m => m.author.id === user.id);
    await channel.bulkDelete(filtered, true);
    return interaction.reply({ content: `Purged recent messages from ${user}.`, ephemeral: true });
  },
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('You need Manage Messages permission.');
    }
    const user = message.mentions.users.first();
    if (!user) return message.reply('Mention a user to purge.');
    const messages = await message.channel.messages.fetch({ limit: 100 });
    const filtered = messages.filter(m => m.author.id === user.id);
    await message.channel.bulkDelete(filtered, true);
    message.reply(`Purged recent messages from ${user}.`);
  }
};
