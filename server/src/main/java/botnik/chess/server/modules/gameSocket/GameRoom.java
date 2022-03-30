package botnik.chess.server.modules.gameSocket;

import botnik.chess.chessai.Board;
import botnik.chess.server.RandomUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.socket.socketio.server.SocketIoNamespace;
import io.socket.socketio.server.SocketIoSocket;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;

public class GameRoom {

    @Getter
    private String roomId;

    private String whitePlayerName = "Daniel";
    private String blackPlayerName = "Shira";

    private SocketIoSocket whitePlayer;
    private SocketIoSocket blackPlayer;
    private SocketIoNamespace namespace;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private Board board;

    public GameRoom(SocketIoSocket whitePlayer,SocketIoSocket blackPlayer,SocketIoNamespace namespace) {
        System.out.println("Created");
        roomId = RandomUtils.randomUUID(10);
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.namespace = namespace;
        Arrays.asList(whitePlayer,blackPlayer).forEach(socketIoSocket -> {
            socketIoSocket.joinRoom(roomId);
            socketIoSocket.on("chat-message", args -> {
                try {
                    String content = args[0].toString();
                    if(content.length() == 0) return;
                    String response = objectMapper.writeValueAsString(new ChatMessage(args[0].toString(),
                            whitePlayer == socketIoSocket ? whitePlayerName : blackPlayerName));
                    namespace.broadcast(roomId,"chat-message",response);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            });
            socketIoSocket.on("move-played", args -> {
               try {
                   ChessMoveMessage chessMoveMessage = objectMapper.readValue(args[0].toString(),ChessMoveMessage.class);
                    socketIoSocket.broadcast(roomId,"move-played",args[0].toString());
               }catch(JsonProcessingException e){
                   e.printStackTrace();
               }
            });
        });

    }

}
