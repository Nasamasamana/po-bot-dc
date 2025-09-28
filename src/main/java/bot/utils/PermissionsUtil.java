package bot.utils;

import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.Permission;

public class PermissionsUtil {
    public static boolean isAdmin(Member member) {
        return member != null && member.hasPermission(Permission.ADMINISTRATOR);
    }
    public static boolean canManageChannels(Member member) {
        return member != null && member.hasPermission(Permission.MANAGE_CHANNEL);
    }
    public static boolean canManageMessages(Member member) {
        return member != null && member.hasPermission(Permission.MESSAGE_MANAGE);
    }
}
