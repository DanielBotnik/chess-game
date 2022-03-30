package botnik.chess.server.modules.gameSocket;

import lombok.*;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChessMoveMessage {

    private int from_file;
    private int from_rank;
    private int to_file;
    private int to_rank;

    private String promote;
}
