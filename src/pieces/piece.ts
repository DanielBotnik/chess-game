import type { Color, Move, Board } from "../types";

export abstract class Piece {
    
    constructor(public color: Color ,public rank: number,public file: number){
        this.color = color;
        this.rank = rank;
        this.file = file;
    }
    
    moveToCheck(board: Board ,move: Move): void {
        board[this.rank-1][this.file-1].piece = null;
        this.rank = move.rank + 1;
        this.file = move.file + 1;
        board[move.rank][move.file].piece = this;
    }

    moveToReal(board: Board,move: Move): void {
        this.moveToCheck(board,move);
    }

    abstract getMoves(board: Board): Array<Move>;
}