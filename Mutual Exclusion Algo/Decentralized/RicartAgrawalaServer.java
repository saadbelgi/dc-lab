import java.io.*;
import java.net.*;

public class RicartAgrawalaServer {
    private static boolean inCriticalSection = false;
    private static int numReplies = 0;

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5000);
        System.out.println("Ricart-Agrawala server started.");
        Socket clientSocket = serverSocket.accept();
        System.out.println("Client connected.");

        PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
            if (inputLine.equals("request")) {
                System.out.println("Received request from teacher.");
                if (!inCriticalSection) {
                    out.println("granted");
                    System.out.println("Course granted to teacher.");
                    inCriticalSection = true;
                } else {
                    out.println("reply");
                    System.out.println("Course alread alloted. Sending reply to teacher.");
                }
            } else if (inputLine.equals("reply")) {
                numReplies++;
                System.out.println("Received reply from another teacher. Replies: " + numReplies);
                if (numReplies == 2) { // Assuming there are 2 other processes in this example
                    out.println("granted");
                    System.out.println("Course granted to teacher.");
                    inCriticalSection = true;
                }
            } else if (inputLine.equals("release")) {
                inCriticalSection = false;
                numReplies = 0;
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
