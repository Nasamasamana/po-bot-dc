package bot.commands;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;

public class HelpCommand {
    private static final String HELP_TEXT = "**Commands:**\n"
        + "`/say` or `p!say #channel message` — Send a message (admin only)\n"
        + "`/lock` or `p!lock [#channel]` — Lock a channel\n"
        + "`/unlock` or `p!unlock [#channel]` — Unlock a channel\n"
        + "`/purgeuser` or `p!purgeuser @user` — Delete all messages from a user\n"
        + "`/createannounce` — Start an announcement draft (admin only)\n"
        + "`/previewannounce` — Preview your announcement embed (admin only)\n"
        + "`/uploadannounce` — Publish your announcement (admin only)\n"
        + "`/help` — Show this help message\n";

    public static void handlePrefix(MessageReceivedEvent event, String args) {
        event.getChannel().sendMessage(HELP_TEXT).queue();
    }

    public static void handleSlash(SlashCommandInteractionEvent event) {
        event.reply(HELP_TEXT).setEphemeral(true).queue();
    }
}
