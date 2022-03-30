import type { Color } from '../types';
import type { Move, Board } from '../types';
import { Piece } from './piece';

export class Rook extends Piece {
    
    public hasMoved: boolean;

    constructor(color: Color,rank: number,file: number){
        super(color,rank,file);
    }
    
    getMoves(board: Board): Array<Move> {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;
        let moves: Array<Move> = [];
        let up: number, down: number, left: number, right: number;
        up = down = left = right = 1;
        while(board[rank+up] && !board[rank+up][file].piece){
            moves.push({
                rank: rank+up,
                file: file,
            });
            up++;
        }
        if(board[rank+up] && board[rank+up][file].piece &&
            board[rank+up][file].piece.color != this.color){
                moves.push({
                    rank: rank+up,
                    file: file
                });
        }
        while(board[rank-down] && !board[rank-down][file].piece){
            moves.push({
                rank: rank-down,
                file: file,
            });
            down++;
        }
        if(board[rank-down] && board[rank-down][file].piece &&
            board[rank-down][file].piece.color != this.color){
                moves.push({
                    rank: rank-down,
                    file: file
                });
        }
        while(board[rank][file+left] && !board[rank][file+left].piece){
            moves.push({
                rank: rank,
                file: file+left,
            });
            left++;
        }
        if(board[rank][file+left] && board[rank][file+left].piece &&
            board[rank][file+left].piece.color != this.color){
                moves.push({
                    rank: rank,
                    file: file+left
                });
        }
        while(board[rank][file-right] && !board[rank][file-right].piece){
            moves.push({
                rank: rank,
                file: file-right,
            });
            right++;
        }
        if(board[rank][file-right] && board[rank][file-right].piece &&
            board[rank][file-right].piece.color != this.color){
                moves.push({
                    rank: rank,
                    file: file-right
                });
        }
        return moves;
    }

    moveToReal(board: Board,move: Move): void {
        this.hasMoved = true;
        super.moveToReal(board,move);
    }
}