const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyannounce')
        .setDescription('Copy a message (text, embeds, attachments) from any channel by ID and post it in another channel.')
        .addChannelOption(option =>
            option.setName('source_channel')
                .setDescription('The channel where the message is located')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to copy')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('target_channel')
                .setDescription('The channel to post the message in')
                .setRequired(true)),
    
    async execute(interaction) {
        const sourceChannel = interaction.options.getChannel('source_channel');
        const targetChannel = interaction.options.getChannel('target_channel');
        const messageId = interaction.options.getString('message_id');

        try {
            const fetchedMessage = await sourceChannel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds || [];
            const attachments = fetchedMessage.attachments.map(att => att.url) || [];
            const files = attachments.map(url => new MessageAttachment(url));

            await targetChannel.send({ content, embeds, files });
            await interaction.reply({ content: `Message copied from ${sourceChannel} to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to fetch or send the message. Make sure the channel and ID are correct.', ephemeral: true });
        }
    },

    // Prefix command
    async prefixExecute(message, args) {
        if (args.length < 3) return message.channel.send('Usage: p!copyannounce #source_channel <message_id> #target_channel');

        const sourceChannel = message.mentions.channels.first();
        const messageId = args[1];
        const targetChannel = message.mentions.channels.last();

        if (!sourceChannel || !targetChannel) return message.channel.send('Please mention valid source and target channels.');

        try {
            const fetchedMessage = await sourceChannel.messages.fetch(messageId);

            const content = fetchedMessage.content || null;
            const embeds = fetchedMessage.embeds || [];
            const attachments = fetchedMessage.attachments.map(att => att.url) || [];
            const files = attachments.map(url => new MessageAttachment(url));

            await targetChannel.send({ content, embeds, files });
            message.channel.send(`Message copied from ${sourceChannel} to ${targetChannel}!`);

        } catch (error) {
            console.error(error);
            message.channel.send('Failed to fetch or send the message. Make sure the channel and ID are correct.');
        }
    }
};
