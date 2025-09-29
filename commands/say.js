const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say something")
    .addStringOption(option =>
      option
        .setName("message")
        .setDescription("What should I say?")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Step 1: Acknowledge immediately (prevents the error)
      await interaction.deferReply();

      // Step 2: Get user input
      const message = interaction.options.getString("message");

      // Step 3: Send the final response
      await interaction.editReply(message);
    } catch (error) {
      console.error("Error in /say command:", error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply("⚠️ Something went wrong!");
      } else {
        await interaction.reply("⚠️ Something went wrong!");
      }
    }
  },
};
