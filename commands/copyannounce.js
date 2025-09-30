const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

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

            // Attach Discord-uploaded files
            for (const att of fetchedMessage.attachments.values()) {
                files.push(new AttachmentBuilder(att.url).setName(att.name));
            }

            // Handle external media links in content (optional)
            const urlRegex = /(https?:\/\/\S+\.(?:png|jpg|jpeg|gif|webp|mp4|mov))/gi;
            const urls = content ? content.match(urlRegex) : [];
            if (urls) {
                for (const url of urls) {
                    try {
                        const response = await axios.get(url, { responseType: 'arraybuffer' });
                        const buffer = Buffer.from(response.data, 'binary');
                        const name = url.split('/').pop().split('?')[0];
                        files.push(new AttachmentBuilder(buffer, { name }));
                    } catch {
                        embeds.push(new EmbedBuilder().setImage(url));
                    }
                }
            }

            await targetChannel.send({ content, embeds, files });
            await interaction.reply({ content: `Message copied to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                interaction.reply({ content: 'Failed to copy message. Make sure the ID is correct and the bot has permission.', ephemeral: true });
            }
        }
    }
};
