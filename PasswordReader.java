import java.io.*;
import java.nio.file.*;

public class PasswordReader {
    private static final String PASSWORD_FILE = "passwords.txt";

    public static void main(String[] args) {
        try {
            // Check if file exists
            if (!Files.exists(Paths.get(PASSWORD_FILE))) {
                System.out.println("No passwords have been saved yet.");
                return;
            }

            // Read all lines from the file
            System.out.println("\n=== Saved Passwords ===\n");
            Files.lines(Paths.get(PASSWORD_FILE))
                .forEach(line -> System.out.println(line));
            System.out.println("\n=====================\n");

        } catch (IOException e) {
            System.err.println("Error reading passwords: " + e.getMessage());
        }
    }
} 