const { SlashCommandBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purgeuser')
    .setDescription('Delete recent messages from a user across all channels (Administrator only)')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('User to purge')
        .setRequired(true)
    ),

  // Slash command version
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '❌ You need Administrator permission.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    // Ask for confirmation with buttons
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('✅ Confirm')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('❌ Cancel')
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await interaction.reply({
      content: `⚠️ Are you sure you want to purge messages from ${user.tag} across all channels?`,
      components: [row],
      ephemeral: true
    });

    // Collector for button press
    const collector = msg.createMessageComponentCollector({ time: 15000, max: 1 });

    collector.on('collect', async i => {
      if (i.customId === 'cancel') {
        return i.update({ content: '❌ Purge cancelled.', components: [] });
      }

      if (i.customId === 'confirm') {
        let totalDeleted = 0;

        for (const [id, channel] of interaction.guild.channels.cache) {
          if (!channel.isTextBased() || !channel.viewable || !channel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.ManageMessages)) {
            continue;
          }

          try {
            const messages = await channel.messages.fetch({ limit: 100 });
            const filtered = messages.filter(m => m.author.id === user.id);
            if (filtered.size > 0) {
              const deleted = await channel.bulkDelete(filtered, true);
              totalDeleted += deleted.size;
            }
          } catch (err) {
            console.error(`Failed to purge in ${channel.name}:`, err.message);
          }
        }

        return i.update({ content: `🧹 Deleted ${totalDeleted} messages from ${user.tag} across all channels.`, components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        msg.edit({ content: '⌛ Timed out. Purge cancelled.', components: [] });
      }
    });
  },

  // Prefix version
  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You need Administrator permission.');
    }

    const user = message.mentions.users.first();
    if (!user) return message.reply('👉 Please mention a user to purge.\nExample: `p!purgeuser @User`');

    message.reply(`⚠️ Are you sure you want to purge messages from ${user.tag} across all channels? Reply with "yes" within 15s to confirm.`);

    // Await confirmation
    const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === 'yes';
    const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000 });

    if (!collected.size) {
      return message.reply('⌛ Timed out. Purge cancelled.');
    }

    let totalDeleted = 0;

    for (const [id, channel] of message.guild.channels.cache) {
      if (!channel.isTextBased() || !channel.viewable || !channel.permissionsFor(message.guild.members.me).has(Permiss
