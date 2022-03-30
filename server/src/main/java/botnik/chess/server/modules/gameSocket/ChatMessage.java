package botnik.chess.server.modules.gameSocket;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private String content;
    private String sender;

}