const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyannounce')
        .setDescription('Copy a message (text, embeds, attachments) and post it in another channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to post the message in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to copy')
                .setRequired(true)),
    
    async execute(interaction) {
        const targetChannel = interaction.options.getChannel('channel');
        const messageId = interaction.options.getString('message_id');

        try {
            const fetchedMessage = await interaction.channel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds || [];
            const attachments = fetchedMessage.attachments.map(att => att.url) || [];

            const files = attachments.map(url => new MessageAttachment(url));

            await targetChannel.send({ content, embeds, files });

            await interaction.reply({ content: `Message copied to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to fetch or send the message. Make sure the ID is correct.', ephemeral: true });
        }
    },

    // Prefix command
    async prefixExecute(message, args) {
        if (args.length < 2) return message.channel.send('Usage: p!copyannounce #channel <message_id>');

        const targetChannel = message.mentions.channels.first();
        const messageId = args[1];

        if (!targetChannel) return message.channel.send('Please mention a valid channel.');

        try {
            const fetchedMessage = await message.channel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds || [];
            const attachments = fetchedMessage.attachments.map(att => att.url) || [];
            const files = attachments.map(url => new MessageAttachment(url));

            await targetChannel.send({ content, embeds, files });

            message.channel.send(`Message copied to ${targetChannel}!`);

        } catch (error) {
            console.error(error);
            message.channel.send('Failed to fetch or send the message. Make sure the ID is correct.');
        }
    }
};
