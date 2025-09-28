package bot.commands;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import bot.utils.PermissionsUtil;
import bot.AnnounceTempStorage;

public class UploadAnnounceCommand {
    public static void handlePrefix(MessageReceivedEvent event, String args) {
        Member member = event.getMember();
        if (!PermissionsUtil.isAdmin(member)) {
            event.getChannel().sendMessage("You need Administrator permission to use this command.").queue();
            return;
        }
        AnnounceTempStorage.AnnounceData data = AnnounceTempStorage.get(member.getIdLong());
        if (data == null) {
            event.getChannel().sendMessage("No announcement draft found. Use p!createannounce first.").queue();
            return;
        }
        TextChannel channel = event.getChannel().asTextChannel();
        EmbedBuilder eb = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(data.content)
            .setColor(java.awt.Color.decode(data.color));
        if (!data.thumbnailUrl.isEmpty()) eb.setThumbnail(data.thumbnailUrl);
        if (!data.imageUrl.isEmpty()) eb.setImage(data.imageUrl);
        channel.sendMessageEmbeds(eb.build()).queue();
        AnnounceTempStorage.remove(member.getIdLong());
        event.getChannel().sendMessage("Announcement sent and draft cleared!").queue();
    }

    public static void handleSlash(SlashCommandInteractionEvent event) {
        Member member = event.getMember();
        if (!PermissionsUtil.isAdmin(member)) {
            event.reply("You need Administrator permission to use this command.").setEphemeral(true).queue();
            return;
        }
        AnnounceTempStorage.AnnounceData data = AnnounceTempStorage.get(member.getIdLong());
        if (data == null) {
            event.reply("No announcement draft found. Use /createannounce first.").setEphemeral(true).queue();
            return;
        }
        GuildChannel channel = event.getOption("channel") != null ? event.getOption("channel").getAsGuildChannel() : event.getChannel();
        if (!(channel instanceof TextChannel)) {
            event.reply("Channel must be a text channel!").setEphemeral(true).queue();
            return;
        }
        EmbedBuilder eb = new EmbedBuilder()
            .setTitle(data.title)
            .setDescription(data.content)
            .setColor(java.awt.Color.decode(data.color));
        if (!data.thumbnailUrl.isEmpty()) eb.setThumbnail(data.thumbnailUrl);
        if (!data.imageUrl.isEmpty()) eb.setImage(data.imageUrl);
        ((TextChannel) channel).sendMessageEmbeds(eb.build()).queue();
        AnnounceTempStorage.remove(member.getIdLong());
        event.reply("Announcement sent and draft cleared!").setEphemeral(true).queue();
    }
}
