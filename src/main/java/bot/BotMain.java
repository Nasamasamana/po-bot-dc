package bot;

import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import javax.security.auth.login.LoginException;

public class BotMain {
    public static void main(String[] args) throws LoginException {
        // Start keep-alive HTTP server for UptimeRobot
        try {
            KeepAliveServer.start(8080);
        } catch (Exception e) {
            System.err.println("Failed to start KeepAliveServer: " + e.getMessage());
        }

        String token = System.getenv("DISCORD_TOKEN");
        if (token == null) {
            System.err.println("DISCORD_TOKEN env variable not set!");
            return;
        }

        JDABuilder.createDefault(token)
            .setActivity(Activity.playing("with p!help & /help"))
            .addEventListeners(new CommandManager())
            .build();
    }
}
