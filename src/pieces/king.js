export class King {
    
    constructor(color,rank,file) {
        this.color = color;
        this.rank = rank;
        this.file = file;
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
}