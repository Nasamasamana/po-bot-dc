package bot;

import java.util.concurrent.*;
import java.util.*;

public class AnnounceTempStorage {
    private static final Map<Long, AnnounceData> storage = new ConcurrentHashMap<>();
    private static final Map<Long, Long> timestamps = new ConcurrentHashMap<>();
    private static final long EXPIRY_MS = 30 * 60 * 1000; // 30 min

    public static void put(long userId, AnnounceData data) {
        storage.put(userId, data);
        timestamps.put(userId, System.currentTimeMillis());
    }
    public static AnnounceData get(long userId) {
        if (timestamps.containsKey(userId) &&
            System.currentTimeMillis() - timestamps.get(userId) < EXPIRY_MS) {
            return storage.get(userId);
        }
        remove(userId);
        return null;
    }
    public static void remove(long userId) {
        storage.remove(userId);
        timestamps.remove(userId);
    }
    // Call periodically or on access to clean expired entries
    public static void cleanExpired() {
        long now = System.currentTimeMillis();
        for (Long userId : new HashSet<>(timestamps.keySet())) {
            if (now - timestamps.get(userId) >= EXPIRY_MS) {
                remove(userId);
            }
        }
    }
    public static class AnnounceData {
        public String title, header, content, color, thumbnailUrl, imageUrl;
        // Add constructors/getters/setters as needed
    }
}
