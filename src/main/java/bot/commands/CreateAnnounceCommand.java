package bot.commands;

import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.entities.Member;
import bot.utils.PermissionsUtil;
import bot.AnnounceTempStorage;

public class CreateAnnounceCommand {
    public static void handlePrefix(MessageReceivedEvent event, String args) {
        Member member = event.getMember();
        if (!PermissionsUtil.isAdmin(member)) {
            event.getChannel().sendMessage("You need Administrator permission to use this command.").queue();
            return;
        }
        // For demo: Just store a sample announce; in full use, you'd parse args or prompt DMs
        AnnounceTempStorage.AnnounceData data = new AnnounceTempStorage.AnnounceData();
        data.title = "Sample Title";
        data.header = "Sample Header";
        data.content = "Sample Content";
        data.color = "#00FFAA";
        data.thumbnailUrl = "";
        data.imageUrl = "";
        AnnounceTempStorage.put(member.getIdLong(), data);
        event.getChannel().sendMessage("Announcement draft created (demo)! Use p!previewannounce to preview.").queue();
    }

    public static void handleSlash(SlashCommandInteractionEvent event) {
        Member member = event.getMember();
        if (!PermissionsUtil.isAdmin(member)) {
            event.reply("You need Administrator permission to use this command.").setEphemeral(true).queue();
            return;
        }
        // For demo: Just store a sample announce; in full use, you'd use modal forms or options
        AnnounceTempStorage.AnnounceData data = new AnnounceTempStorage.AnnounceData();
        data.title = "Sample Title";
        data.header = "Sample Header";
        data.content = "Sample Content";
        data.color = "#00FFAA";
        data.thumbnailUrl = "";
        data.imageUrl = "";
        AnnounceTempStorage.put(member.getIdLong(), data);
        event.reply("Announcement draft created (demo)! Use /previewannounce to preview.").setEphemeral(true).queue();
    }
}
