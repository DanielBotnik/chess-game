package botnik.chess.server;

public class RandomUtils {

    private static final String UUID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int UUID_CHARS_LENGTH = UUID_CHARS.length();

    public static String randomUUID(int length){
        StringBuilder stringBuilder = new StringBuilder(length);
        for(int i = 0 ; i < length ; i++)
            stringBuilder.append(UUID_CHARS.charAt((int) (Math.random() * UUID_CHARS_LENGTH)));
        return stringBuilder.toString();
    }
}
