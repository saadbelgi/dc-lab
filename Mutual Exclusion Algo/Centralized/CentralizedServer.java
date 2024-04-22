import java.io.*;
import java.net.*;

public class CentralizedServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(5000);
        System.out.println("Centralized server started.");
        Socket clientSocket = serverSocket.accept();
        System.out.println("Client connected.");

        PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
        BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
            if (inputLine.equals("request")) {
                out.println("granted");
                System.out.println("Course granted to teacher.");
            } else if (inputLine.equals("release")) {
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
