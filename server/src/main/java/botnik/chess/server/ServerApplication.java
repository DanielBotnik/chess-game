package botnik.chess.server;


import botnik.chess.server.modules.gameSocket.ChatMessage;
import botnik.chess.server.modules.gameSocket.GameRoom;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.socket.engineio.server.EngineIoServer;
import io.socket.engineio.server.EngineIoServerOptions;
import io.socket.engineio.server.EngineIoWebSocket;
import io.socket.socketio.server.SocketIoServer;
import io.socket.socketio.server.SocketIoServerOptions;
import io.socket.socketio.server.SocketIoSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class ServerApplication {

    @Autowired
    private ObjectMapper objectMapper;

    private HashMap<String, GameRoom> rooms = new HashMap<>();

    private SocketIoSocket socket;

    @Bean
    public EngineIoServer engineIoServer(){
        EngineIoServerOptions options = EngineIoServerOptions.newFromDefault();
        options.setAllowedCorsOrigins(null);
        options.setPingTimeout(30000);
        SocketIoServerOptions options1 = SocketIoServerOptions.newFromDefault();
        EngineIoServer engineIoServer = new EngineIoServer(options);
        SocketIoServer socketIoServer = new SocketIoServer(engineIoServer,options1);
        socketIoServer.namespace("/game").on("connection", args -> {
            if(socket != null){
                GameRoom room = new GameRoom(socket,(SocketIoSocket) args[0],socketIoServer.namespace("/game"));
                rooms.put(room.getRoomId(),room);
                socket = null;
            }
            socket = (SocketIoSocket) args[0];
        });
        return engineIoServer;
    }
//    @Bean
//    public EngineIoServer engineIoServer(){
//        EngineIoServerOptions options = EngineIoServerOptions.newFromDefault();
//        options.setAllowedCorsOrigins(null);
//        options.setPingTimeout(30000);
//        EngineIoServer engineIoServer = new EngineIoServer(options);
//        engineIoServer.on("connection", args -> {
//            System.out.println("CONNECTION");
//        });
//        SocketIoServer socketIoServer = new SocketIoServer(engineIoServer);
//        socketIoServer.namespace("/game").on("connection", args -> {
//            System.out.println("Connected");
//        });
//        return engineIoServer;
//    }



    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class,args);
    }

}

