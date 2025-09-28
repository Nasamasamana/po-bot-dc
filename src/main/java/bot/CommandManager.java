package bot;

import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;

public class CommandManager extends ListenerAdapter {
    private final PrefixCommandManager prefixManager = new PrefixCommandManager();
    private final SlashCommandManager slashManager = new SlashCommandManager();

    @Override
    public void onMessageReceived(MessageReceivedEvent event) {
        prefixManager.handle(event);
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        slashManager.handle(event);
    }
}
