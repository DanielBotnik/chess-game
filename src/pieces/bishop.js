import { Piece } from './piece'

export class Bishop extends Piece{
    
    constructor(color,rank,file){
        super(color,rank,file);
    }

    getMoves(board) {
        var rank = this.rank - 1;
        var file = this.file - 1;
        var moves = [];
        if(board[rank+2] && board[rank+2][file+1] && board[rank+2][file+1].piece?.color != this.color)
            moves.push({
                i: rank+2,
                j: file+1,
            });
        if(board[rank+2] && board[rank+2][file-1] && board[rank+2][file-1].piece?.color != this.color)
            moves.push({
                i: rank+2,
                j: file-1,
            });
        if(board[rank-2] && board[rank-2][file+1] && board[rank-2][file+1].piece?.color != this.color)
            moves.push({
                i: rank-2,
                j: file+1,
            });
        if(board[rank-2] && board[rank-2][file-1] && board[rank-2][file-1].piece?.color != this.color)
            moves.push({
                i: rank-2,
                j: file-1,
            });
        if(board[rank+1] && board[rank+1][file+2] && board[rank+1][file+2].piece?.color != this.color)
            moves.push({
                i: rank+1,
                j: file+2,
            });
        if(board[rank-1] && board[rank-1][file+2] && board[rank-1][file+2].piece?.color != this.color)
            moves.push({
                i: rank-1,
                j: file+2,
            });  
        if(board[rank+1] && board[rank+1][file-2] && board[rank+1][file-2].piece?.color != this.color)
            moves.push({
                i: rank+1,
                j: file-2,
            });
        if(board[rank-1] && board[rank-1][file-2] && board[rank-1][file-2].piece?.color != this.color)
            moves.push({
                i: rank-1,
                j: file-2,
            });
        return moves;
    }
}