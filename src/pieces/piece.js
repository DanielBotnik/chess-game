export class Piece {
    
    constructor(color,rank,file){
        this.color = color;
        this.rank = rank;
        this.file = file;
    }
    
    moveToCheck(board,move){
        board[this.rank-1][this.file-1].piece = null;
        this.rank = move.i + 1;
        this.file = move.j + 1;
        board[move.i][move.j].piece = this;
    }

    moveToReal(board,move){
        this.moveToCheck(board,move);
    }

    getMoves(board){
        // Each piece implements its own.
    }
}