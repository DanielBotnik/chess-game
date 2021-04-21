import { Piece } from './piece'

export class King extends Piece{
    
    constructor(color,rank,file) {
        super(color,rank,file);
        this.hasMoved = false;
    }

    getMoves(board) {
        var rank = this.rank - 1;
        var file = this.file - 1;
        var moves = [];
        if(board[rank+1] && board[rank+1][file+1] && board[rank+1][file+1].piece?.color != this.color)
            moves.push({
                i: rank+1,
                j: file+1,
            });
        if(board[rank+1] && board[rank+1][file] && board[rank+1][file].piece?.color != this.color)
            moves.push({
                i: rank+1,
                j: file,
            });
        if(board[rank+1] && board[rank+1][file-1] && board[rank+1][file-1].piece?.color != this.color)
            moves.push({
                i: rank+1,
                j: file-1,
            });
        if(board[rank][file+1] && board[rank][file+1].piece?.color != this.color)
            moves.push({
                i: rank,
                j: file+1,
            });
        if(board[rank][file-1] && board[rank][file-1].piece?.color != this.color)
            moves.push({
                i: rank,
                j: file-1,
            });
        if(board[rank-1] && board[rank-1][file+1] && board[rank-1][file+1].piece?.color != this.color)
        moves.push({
            i: rank-1,
            j: file+1,
        });
        if(board[rank-1] && board[rank-1][file] && board[rank-1][file].piece?.color != this.color)
            moves.push({
                i: rank-1,
                j: file,
            });
        if(board[rank-1] && board[rank-1][file-1] && board[rank-1][file-1].piece?.color != this.color)
            moves.push({
                i: rank-1,
                j: file-1,
            });
        return moves;
    }

    // isChecked(board) {
    //     var rank = this.rank - 1;
    //     var file = this.file - 1;
    //     var up,down,left,right,leftUp,rightUp,leftDown,rightDown;
    //     up = down = left = right = leftUp = rightUp = leftDown = rightDown = 1;
    //     //Pawn/Queen Is Attacking
    //     while(board[rank+up] && !board[rank+up][file].piece)
    //         up++;
    //     if(board[rank+up] && board[rank+up][file].piece.color != this.color && 
    //         ['queen','rook'].includes(board[rank+up][file].piece.constructor.name))
    //         return true;
    //     while(board[rank-down] && !board[rank-down][file].piece)
    //         down++;
    //     if(board[rank-down] && board[rank-down][file].piece.color != this.color &&
    //         ['queen','rook'].includes(board[rank-down][file].piece.constructor.name))
    //         return true;
    //     while(board[rank][file+left] && !board[rank][file+left].piece)
    //         left++;
    //     if(board[rank][file+left] && board[rank][file+left].piece.color != this.color &&
    //         ['queen','rook'].includes(board[rank][file+left].piece.constructor.name))
    //         return true;
    //     while(board[rank][file-right] && !board[rank][file-right].piece)
    //         right++;
    //     if(board[rank][file-right] && board[rank][file-right].piece.color != this.color &&
    //         ['queen','rook'].includes(board[rank][file-right].piece.constructor.name))
    //         return true;
    //     //Check Pawns
    // }
}