import { Piece } from './piece'

export class Pawn extends Piece {
    
    constructor(color,rank,file,enPassant) {
        super(color,rank,file);
        this.hasMoved = !((rank === 2 && color === 'w') || (rank === 7 && color === 'b'));
        this.enPassant = false;
        this.enPassant = !!enPassant;
    }

    getMoves(board) {
        var rank = this.rank - 1;
        var file = this.file - 1;
        var moves = [];
        var moveDirection = this.color === 'w' ? 1 : -1;
        if(!board[rank+moveDirection][file].piece){
            moves.push({
                i: rank+moveDirection,
                j: file,
            });
        }
        if(!this.hasMoved && !board[rank+moveDirection*2][file].piece && !board[rank+moveDirection][file].piece){
            moves.push({
                i: rank+moveDirection*2,
                j: file,
            });
        }
        if(board[rank+moveDirection][file+1]?.piece && 
            board[rank+moveDirection][file+1].piece?.color != this.color){
            moves.push({
                i: rank+moveDirection,
                j: file+1,
            })
        }
        if(board[rank+moveDirection][file-1]?.piece && 
            board[rank+moveDirection][file-1].piece?.color != this.color){
            moves.push({
                i: rank+moveDirection,
                j: file-1,
            })
        }
        if(board[rank][file-1]?.piece && board[rank][file-1].piece.color != this.color &&
            board[rank][file-1].piece.constructor.name === 'Pawn' && board[rank][file-1].piece.enPassant)
            moves.push({
                i: rank+moveDirection,
                j: file-1,
                special: 'enPassant'
            });
        if(board[rank][file+1]?.piece && board[rank][file+1].piece.color != this.color &&
            board[rank][file+1].piece.constructor.name === 'Pawn' && board[rank][file+1].piece.enPassant)
            moves.push({
                i: rank+moveDirection,
                j: file+1,
                special: 'enPassant'
            });
        return moves;
    }

    moveToReal(board,move){
        if(Math.abs(move.i - this.rank+1) === 2)
            this.enPassant = true;
        this.hasMoved = true;
        super.moveToReal(board,move);
    }
    
}