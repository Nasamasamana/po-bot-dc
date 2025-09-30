const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, PermissionsBitField } = require('discord.js');
const axios = require('axios'); // we'll fetch attachments as buffer

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyannounce')
        .setDescription('Copy a message (text, embeds, attachments) from this channel and post it in another channel.')
        .addChannelOption(option =>
            option.setName('target_channel')
                .setDescription('The channel to post the message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to copy')
                .setRequired(true)),

    async execute(interaction) {
        // Check for Administrator permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You need Administrator permission to use this command.', ephemeral: true });
        }

        const targetChannel = interaction.options.getChannel('target_channel');
        const messageId = interaction.options.getString('message_id');

        try {
            // Fetch message from current channel
            const fetchedMessage = await interaction.channel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds || [];
            const files = [];

            // Fetch each attachment as a buffer
            for (const att of fetchedMessage.attachments.values()) {
                const response = await axios.get(att.url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(response.data, 'binary');
                files.push(new MessageAttachment(buffer, att.name));
            }

            await targetChannel.send({ content, embeds, files });
            await interaction.reply({ content: `Message copied to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to fetch or send the message. Make sure the ID is correct and the bot has permission to send messages.', ephemeral: true });
        }
    }
};
