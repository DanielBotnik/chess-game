import { Piece } from './piece'

export class Rook extends Piece{
    
    constructor(color,rank,file){
        super(color,rank,file);
        this.hasMoved = false;
    }
    
    getMoves(board) {
        var rank = this.rank - 1;
        var file = this.file - 1;
        var moves = [];
        var up, down, left, right;
        up = down = left = right = 1;
        while(board[rank+up] && !board[rank+up][file].piece){
            moves.push({
                i:rank+up,
                j:file,
            });
            up++;
        }
        if(board[rank+up] && board[rank+up][file].piece &&
            board[rank+up][file].piece.color != this.color){
                moves.push({
                    i:rank+up,
                    j:file
                });
        }
        while(board[rank-down] && !board[rank-down][file].piece){
            moves.push({
                i:rank-down,
                j:file,
            });
            down++;
        }
        if(board[rank-down] && board[rank-down][file].piece &&
            board[rank-down][file].piece.color != this.color){
                moves.push({
                    i:rank-down,
                    j:file
                });
        }
        while(board[rank][file+left] && !board[rank][file+left].piece){
            moves.push({
                i:rank,
                j:file+left,
            });
            left++;
        }
        if(board[rank][file+left] && board[rank][file+left].piece &&
            board[rank][file+left].piece.color != this.color){
                moves.push({
                    i:rank,
                    j:file+left
                });
        }
        while(board[rank][file-right] && !board[rank][file-right].piece){
            moves.push({
                i:rank,
                j:file-right,
            });
            right++;
        }
        if(board[rank][file-right] && board[rank][file-right].piece &&
            board[rank][file-right].piece.color != this.color){
                moves.push({
                    i:rank,
                    j:file-right
                });
        }
        return moves;
    }

    moveToReal(board,move){
        this.hasMoved = true;
        super.moveToReal(board,move);
    }
}