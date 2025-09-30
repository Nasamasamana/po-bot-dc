const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('copyannounce')
        .setDescription('Copy an embed from a message and post it in another channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to post the embed in')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message containing the embed')
                .setRequired(true)),
    
    async execute(interaction) {
        const targetChannel = interaction.options.getChannel('channel');
        const messageId = interaction.options.getString('message_id');

        try {
            // Fetch the message from the current channel
            const fetchedMessage = await interaction.channel.messages.fetch(messageId);

            if (!fetchedMessage.embeds.length) {
                return interaction.reply({ content: 'This message has no embeds!', ephemeral: true });
            }

            // Repost each embed in the target channel
            for (const embed of fetchedMessage.embeds) {
                await targetChannel.send({ embeds: [embed] });
            }

            await interaction.reply({ content: `Embed copied to ${targetChannel}!`, ephemeral: true });

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'Failed to fetch or send the message. Make sure the ID is correct.', ephemeral: true });
        }
    },

    // Prefix command
    async prefixExecute(message, args) {
        if (args.length < 2) {
            return message.channel.send('Usage: p!copyannounce #channel <message_id>');
        }

        const targetChannel = message.mentions.channels.first();
        const messageId = args[1];

        if (!targetChannel) return message.channel.send('Please mention a valid channel.');

        try {
            const fetchedMessage = await message.channel.messages.fetch(messageId);

            if (!fetchedMessage.embeds.length) {
                return message.channel.send('This message has no embeds!');
            }

            for (const embed of fetchedMessage.embeds) {
                await targetChannel.send({ embeds: [embed] });
            }

            message.channel.send(`Embed copied to ${targetChannel}!`);

        } catch (error) {
            console.error(error);
            message.channel.send('Failed to fetch or send the message. Make sure the ID is correct.');
        }
    }
};
