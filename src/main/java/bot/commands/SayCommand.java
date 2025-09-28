package bot.commands;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import bot.utils.PermissionsUtil;

public class SayCommand {
    // Prefix: p!say #channel message
    public static void handlePrefix(MessageReceivedEvent event, String args) {
        Member member = event.getMember();
        if (!PermissionsUtil.isAdmin(member)) {
            event.getChannel().sendMessage("You need Administrator permission to use this command.").queue();
            return;
        }
        if (!args.startsWith("<#")) {
            event.getChannel().sendMessage("Usage: p!say #channel message").queue();
            return;
        }
        int firstSpace = args.indexOf('>');
        if (firstSpace == -1 || args.length() <= firstSpace + 1) {
            event.getChannel().sendMessage("Usage: p!say #channel message").queue();
            return;
        }
        String channelId = args.substring(2, firstSpace);
        TextChannel target = event.getJDA().getTextChannelById(channelId);
        if (target == null) {
            event.getChannel().sendMessage("Invalid channel mention.").queue();
            return;
        }
        String message = args.substring(firstSpace + 1).trim();
        if (message.isEmpty()) {
            event.getChannel().sendMessage("You must provide a message.").queue();
            return;
        }
        target.sendMessage(message).queue();
        event.getMessage().addReaction("✅").queue();
    }

    // Slash: /say channel:CHANNEL message:STRING
    public static void handleSlash(SlashCommandInteractionEvent event) {
        Member member = event.getMember();
        if (!PermissionsUtil.isAdmin(member)) {
            event.reply("You need Administrator permission to use this command.").setEphemeral(true).queue();
            return;
        }
        GuildChannel channel = event.getOption("channel").getAsGuildChannel();
        String message = event.getOption("message").getAsString();
        if (!(channel instanceof TextChannel)) {
            event.reply("Channel must be a text channel!").setEphemeral(true).queue();
            return;
        }
        ((TextChannel) channel).sendMessage(message).queue();
        event.reply("Message sent!").setEphemeral(true).queue();
    }
}
