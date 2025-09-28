package bot;

import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import bot.commands.*;

public class PrefixCommandManager {
    public void handle(MessageReceivedEvent event) {
        String raw = event.getMessage().getContentRaw();
        if (!raw.startsWith("p!")) return;
        String[] split = raw.substring(2).split(" ", 2);
        String cmd = split[0].toLowerCase();
        String args = split.length > 1 ? split[1] : "";

        switch (cmd) {
            case "say":
                SayCommand.handlePrefix(event, args);
                break;
            case "lock":
                LockCommand.handlePrefix(event, args);
                break;
            case "unlock":
                UnlockCommand.handlePrefix(event, args);
                break;
            case "purgeuser":
                PurgeUserCommand.handlePrefix(event, args);
                break;
            case "createannounce":
                CreateAnnounceCommand.handlePrefix(event, args);
                break;
            case "previewannounce":
                PreviewAnnounceCommand.handlePrefix(event, args);
                break;
            case "uploadannounce":
                UploadAnnounceCommand.handlePrefix(event, args);
                break;
            case "help":
                HelpCommand.handlePrefix(event, args);
                break;
        }
    }
}
