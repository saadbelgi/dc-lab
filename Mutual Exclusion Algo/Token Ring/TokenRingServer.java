import java.io.*;
import java.net.*;

public class TokenRingServer {
    private static boolean hasToken = true; // Initial token possession

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5000);
        System.out.println("Token Ring server started.");
        Socket clientSocket = serverSocket.accept();
        System.out.println("Client connected.");

        PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
            if (inputLine.equals("request")) {
                if (hasToken) {
                    // Process has token, grant access
                    out.println("granted");
                    System.out.println("Course granted to teacher.");
                    hasToken = false;
                } else {
                    // Process does not have token, deny access
                    out.println("denied");
                    System.out.println("Course denied to teacher.");
                }
            } else if (inputLine.equals("release")) {
                // Process releases token
                hasToken = true;
                out.println("released");
                System.out.println("Course released by teacher.");
            }
        }

        out.close();
        in.close();
        clientSocket.close();
        serverSocket.close();
    }
}
