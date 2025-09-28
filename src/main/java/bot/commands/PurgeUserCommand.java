package bot.commands;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import bot.utils.PermissionsUtil;

public class PurgeUserCommand {
    // Prefix: p!purgeuser @user
    public static void handlePrefix(MessageReceivedEvent event, String args) {
        Member member = event.getMember();
        if (!PermissionsUtil.canManageMessages(member)) {
            event.getChannel().sendMessage("You need Manage Messages permission to use this command.").queue();
            return;
        }
        if (!args.startsWith("<@")) {
            event.getChannel().sendMessage("Usage: p!purgeuser @user").queue();
            return;
        }
        String userId = args.replaceAll("[^0-9]", "");
        User user = event.getJDA().getUserById(userId);
        if (user == null) {
            event.getChannel().sendMessage("User not found.").queue();
            return;
        }
        for (TextChannel ch : event.getGuild().getTextChannels()) {
            ch.getHistory().retrievePast(100).queue(messages -> {
                for (Message m : messages) {
                    if (m.getAuthor().equals(user)) m.delete().queue();
                }
            });
        }
        event.getChannel().sendMessage("Attempted to purge messages from user.").queue();
    }

    // Slash: /purgeuser user:USER
    public static void handleSlash(SlashCommandInteractionEvent event) {
        Member member = event.getMember();
        if (!PermissionsUtil.canManageMessages(member)) {
            event.reply("You need Manage Messages permission to use this command.").setEphemeral(true).queue();
            return;
        }
        User user = event.getOption("user").getAsUser();
        for (TextChannel ch : event.getGuild().getTextChannels()) {
            ch.getHistory().retrievePast(100).queue(messages -> {
                for (Message m : messages) {
                    if (m.getAuthor().equals(user)) m.delete().queue();
                }
            });
        }
        event.reply("Attempted to purge messages from user.").setEphemeral(true).queue();
    }
}
