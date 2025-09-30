const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, PermissionsBitField, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyannounce')
        .setDescription('Copy a message (text, embeds, attachments, external media) from this channel and post it in another channel.')
        .addChannelOption(option =>
            option.setName('target_channel')
                .setDescription('The channel to post the message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to copy')
                .setRequired(true)),

    async execute(interaction) {
        // Check Administrator permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You need Administrator permission to use this command.', ephemeral: true });
        }

        const targetChannel = interaction.options.getChannel('target_channel');
        const messageId = interaction.options.getString('message_id');

        try {
            const fetchedMessage = await interaction.channel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds.map(e => EmbedBuilder.from(e)) || [];
            const files = [];

            // Attach Discord-uploaded files
            for (const att of fetchedMessage.attachments.values()) {
                files.push(new MessageAttachment(att.url, att.name));
            }

            // Detect external media links in message content (simple regex for images)
            const urlRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|mp4|mov))/gi;
            const urls = content ? content.match(urlRegex) : [];
            if (urls) {
                for (const url of urls) {
                    // Add external media as attachment if possible
                    try {
                        const response = await axios.get(url, { responseType: 'arraybuffer' });
                        const buffer = Buffer.from(response.data, 'binary');
                        const name = url.split('/').pop().split('?')[0];
                        files.push(new MessageAttachment(buffer, name));
                    } catch {
                        // If fetching fails, add as embed image instead
                        const embed = new EmbedBuilder().setImage(url);
                        embeds.push(embed);
                    }
                }
            }

            await targetChannel.send({ content, embeds, files });
            await interaction.reply({ content: `Message copied to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to fetch or send the message. Make sure the ID is correct and the bot has permission.', ephemeral: true });
        }
    }
};
