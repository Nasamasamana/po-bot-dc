package bot;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import bot.commands.*;

public class SlashCommandManager {
    public void handle(SlashCommandInteractionEvent event) {
        String cmd = event.getName().toLowerCase();
        switch (cmd) {
            case "say":
                SayCommand.handleSlash(event);
                break;
            case "lock":
                LockCommand.handleSlash(event);
                break;
            case "unlock":
                UnlockCommand.handleSlash(event);
                break;
            case "purgeuser":
                PurgeUserCommand.handleSlash(event);
                break;
            case "createannounce":
                CreateAnnounceCommand.handleSlash(event);
                break;
            case "previewannounce":
                PreviewAnnounceCommand.handleSlash(event);
                break;
            case "uploadannounce":
                UploadAnnounceCommand.handleSlash(event);
                break;
            case "help":
                HelpCommand.handleSlash(event);
                break;
        }
    }
}
