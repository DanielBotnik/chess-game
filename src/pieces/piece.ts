import type { PieceColor, Move, Board } from "../types";

export abstract class Piece {
    
    constructor(public color: PieceColor ,public rank: number,public file: number){
        this.color = color;
        this.rank = rank;
        this.file = file;
    }
    
    moveToCheck(board: Board ,move): void {
        board[this.rank-1][this.file-1].piece = null;
        this.rank = move.i + 1;
        this.file = move.j + 1;
        board[move.i][move.j].piece = this;
    }

    moveToReal(board: Board,move: Move): void {
        this.moveToCheck(board,move);
    }

    abstract getMoves(board: Board): Array<Move>;
}