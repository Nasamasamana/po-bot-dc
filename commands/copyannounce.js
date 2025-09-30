const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, MessageAttachment, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyannounce')
        .setDescription('Copy message with embeds and attachments.') // <= 100 chars
        .addChannelOption(option =>
            option.setName('target_channel')
                .setDescription('The channel to send the message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('ID of the message to copy')
                .setRequired(true)),

    async execute(interaction) {
        // Check admin
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You need Administrator permission.', ephemeral: true });
        }

        const targetChannel = interaction.options.getChannel('target_channel');
        const messageId = interaction.options.getString('message_id');

        try {
            const fetchedMessage = await interaction.channel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds.map(e => EmbedBuilder.from(e)) || [];
            const files = [];

            // Use the 'attachment' property from Discord instead of URL
            for (const att of fetchedMessage.attachments.values()) {
                files.push(new MessageAttachment(att.attachment, att.name));
            }

            await targetChannel.send({ content, embeds, files });
            await interaction.reply({ content: `Message copied to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to copy message. Make sure the ID is correct and the bot has permissions.', ephemeral: true });
        }
    }
};
