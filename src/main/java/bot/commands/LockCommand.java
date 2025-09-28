package bot.commands;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.Permission;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import bot.utils.PermissionsUtil;

public class LockCommand {
    // Prefix: p!lock [#channel]
    public static void handlePrefix(MessageReceivedEvent event, String args) {
        Member member = event.getMember();
        if (!PermissionsUtil.canManageChannels(member)) {
            event.getChannel().sendMessage("You need Manage Channel permission to use this command.").queue();
            return;
        }
        TextChannel channel = event.getChannel().asTextChannel();
        if (args.startsWith("<#")) {
            int firstSpace = args.indexOf('>');
            String channelId = args.substring(2, firstSpace);
            TextChannel mentioned = event.getJDA().getTextChannelById(channelId);
            if (mentioned != null) channel = mentioned;
        }
        channel.getManager().putPermissionOverride(channel.getGuild().getPublicRole(), null, EnumSet.of(Permission.MESSAGE_SEND)).queue();
        event.getChannel().sendMessage("Channel locked.").queue();
    }

    // Slash: /lock [channel:CHANNEL]
    public static void handleSlash(SlashCommandInteractionEvent event) {
        Member member = event.getMember();
        if (!PermissionsUtil.canManageChannels(member)) {
            event.reply("You need Manage Channel permission to use this command.").setEphemeral(true).queue();
            return;
        }
        GuildChannel channel = event.getOption("channel") != null ? event.getOption("channel").getAsGuildChannel() : event.getChannel();
        if (!(channel instanceof TextChannel)) {
            event.reply("Channel must be a text channel!").setEphemeral(true).queue();
            return;
        }
        ((TextChannel) channel).getManager().putPermissionOverride(
            ((TextChannel) channel).getGuild().getPublicRole(), null, EnumSet.of(Permission.MESSAGE_SEND)
        ).queue();
        event.reply("Channel locked.").setEphemeral(true).queue();
    }
}
