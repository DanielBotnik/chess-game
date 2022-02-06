import type { Board, Move } from '../types';
import { Color } from '../types';
import { Piece } from './piece';

export class Pawn extends Piece {
    
    public hasMoved: boolean;
    public enPassant: boolean;

    constructor(color: Color, rank: number, file: number) {
        super(color,rank,file);
        this.hasMoved = !((color == Color.White && rank == 2 ) || (color == Color.Black && rank == 7));
        this.enPassant = false;
    }

    getMoves(board: Board): Array<Move> {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;
        let moves: Array<Move> = [];
        let moveDirection: number = this.color === Color.White ? 1 : -1;
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
            board[rank][file-1].piece instanceof Pawn && (board[rank][file-1].piece as Pawn).enPassant)
            moves.push({
                i: rank+moveDirection,
                j: file-1,
                special: 'enPassant'
            });
        if(board[rank][file+1]?.piece && board[rank][file+1].piece.color != this.color &&
            board[rank][file+1].piece instanceof Pawn && (board[rank][file+1].piece as Pawn).enPassant)
            moves.push({
                i: rank+moveDirection,
                j: file+1,
                special: 'enPassant'
            });
        return moves;
    }

    moveToReal(board: Board,move: Move): void {
        if(Math.abs(move.i - this.rank+1) === 2)
            this.enPassant = true;
        this.hasMoved = true;
        super.moveToReal(board,move);
    }
    
}