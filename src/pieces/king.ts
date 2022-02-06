import { Board, Move, Color } from '../types';
import { Piece } from './piece'
import { Rook } from './rook'
import { Pawn } from './pawn'
import { Queen } from './queen'
import { Bishop } from './bishop'
import { Knight } from './knight'

export class King extends Piece {
    
    public hasMoved: boolean

    constructor(color: Color,rank: number,file: number) {
        super(color,rank,file);
        this.hasMoved = file === 5 && ((rank === 1 && color === Color.White) || (rank === 8 && color === Color.Black));
    }

    getMoves(board: Board): Array<Move> {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;
        let moves: Array<Move> = [rank-1,rank,rank+1].map(rank => {
            if(board[rank]) {
                return [file-1,file,file+1].map(file => {
                    if(board[rank][file] && board[rank][file].piece?.color != this.color)
                        return {
                            i: rank,
                            j: file,
                        }
                })
            }
        }).flat().filter(m => m);
        if(!this.hasMoved && !this.isChecked(board)){
            if(board[rank][7].piece instanceof Rook) {
                let rook = board[rank][7].piece as Rook;
                if(!rook.hasMoved && !board[rank][6].piece && !board[rank][5].piece) {
                    moves.push({
                        i: rank,
                        j: 7,
                        special: 'castling',
                    })
                }
            }
            if(board[rank][0].piece instanceof Rook) {
                let rook = board[rank][0].piece as Rook;
                if(!rook.hasMoved && !board[rank][1].piece && !board[rank][2].piece && !board[rank][3].piece) {
                    moves.push({
                        i: rank,
                        j: 0,
                        special: 'castling',
                    })
                }
            }
        }
        return moves;
    }

    isChecked(board: Board): boolean {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;        
        let up: number, down: number, left: number, right: number, leftUp: number, rightUp: number,leftDown: number,rightDown: number;
        up = down = left = right = leftUp = rightUp = leftDown = rightDown = 1;
        //Pawn is attacking
        let pawnRank: number = rank + (this.color === Color.White ? 1: -1);
        if(board[pawnRank] && [file-1,file+1].some(file => 
            board[pawnRank][file] && board[pawnRank][file].piece?.color !== this.color &&
            board[pawnRank][file].piece instanceof Pawn))
            return true; 
        // }
        //King is attacking
        //I Know king cannot attack but it will make moving king to king not possible
        if([rank-1,rank,rank+1].some(rank => board[rank] && [file-1,file,file+1].some(file =>
            board[rank][file] && board[rank][file].piece?.color !== this.color && board[rank][file].piece instanceof King)))
            return true;
        //Rook \ Queen is attacking
        while(board[rank+up]) {
            if(board[rank+up][file].piece){
                if(board[rank+up][file].piece.color === this.color)
                    break;                
                if(board[rank+up][file].piece instanceof Queen || board[rank+up][file].piece instanceof Rook)
                    return true;
                break;
            }
            up++;
        }
        while(board[rank-down]) {
            if(board[rank-down][file].piece){
                if(board[rank-down][file].piece.color === this.color)
                    break;
                if(board[rank-down][file].piece instanceof Queen || board[rank-down][file].piece instanceof Rook)
                    return true;
                break;
            }
            down++;
        }
        while(board[rank][file-left]) {
            if(board[rank][file-left].piece) {
                if(board[rank][file-left].piece.color === this.color)
                    break;
                if(board[rank][file-left].piece instanceof Queen || board[rank][file-left].piece instanceof Rook)
                    return true;
                break;
            }
            left++;
        }
        while(board[rank][file+right]) {
            if(board[rank][file+right].piece) {
                if(board[rank][file+right].piece.color === this.color)
                    break;
                if(board[rank][file+right].piece instanceof Queen || board[rank][file+right].piece instanceof Rook)
                    return true;
                break;
            }
            right++;
        }
        //Queen \ Bishop is attacking
        while(board[rank+rightUp] && board[rank+rightUp][file+rightUp]){
            if(board[rank+rightUp][file+rightUp].piece) {
                if(board[rank+rightUp][file+rightUp].piece.color === this.color)
                    break;
                if(board[rank+rightUp][file+rightUp].piece instanceof Queen || board[rank+rightUp][file+rightUp].piece instanceof Bishop)
                    return true;
                break;
            }
            rightUp++;
        }
        while(board[rank+leftUp] && board[rank+leftUp][file-leftUp]){
            if(board[rank+leftUp][file-leftUp].piece) {
                if(board[rank+leftUp][file-leftUp].piece.color === this.color)
                    break;
                if(board[rank+leftUp][file-leftUp].piece instanceof Queen || board[rank+leftUp][file-leftUp].piece instanceof Bishop)
                    return true;
                break;
            }
            leftUp++;
        }
        while(board[rank-rightDown] && board[rank-rightDown][file+rightDown]){
            if(board[rank-rightDown][file+rightDown].piece) {
                if(board[rank-rightDown][file+rightDown].piece.color === this.color)
                    break;
                if(board[rank-rightDown][file+rightDown].piece instanceof Queen || board[rank-rightDown][file+rightDown].piece instanceof Bishop)
                    return true;
                break;
            }
            rightDown++;
        }
        while(board[rank-leftDown] && board[rank-leftDown][file-leftDown]){
            if(board[rank-leftDown][file-leftDown].piece) {
                if(board[rank-leftDown][file-leftDown].piece.color === this.color)
                    break;
                if(board[rank-leftDown][file-leftDown].piece instanceof Queen || board[rank-leftDown][file-leftDown].piece instanceof Bishop)
                    return true;
                break;
            }
            leftDown++;
        }
        const knightCheckMoves : Array<[number,Array<number>]> = [[rank+2,[file+1,file-1]],[rank-2,[file+1,file-1]],[rank+1,[file+2,file-2]],[rank-1,[file+2,file-2]]];
        if(knightCheckMoves.some(cords => 
            board[cords[0]] && cords[1].some(file => board[cords[0]][file] && board[cords[0]][file].piece?.color !== this.color 
                && board[cords[0]][file].piece instanceof Knight)))
                return true;
        return false;
    }

    moveToCheck(board: Board, move: Move): void {
        if(move.special === 'castling'){
            if(move.j === 0){
                board[move.i][move.j].piece.file = 4; 
                board[this.rank-1][3].piece = board[move.i][move.j].piece;
                board[this.rank-1][2].piece = this;
                board[this.rank-1][this.file-1].piece = null;
                board[move.i][move.j].piece = null;
                this.file = 3;
            }
            else {
                board[move.i][move.j].piece.file = 6; 
                board[this.rank-1][5].piece = board[move.i][move.j].piece;
                board[this.rank-1][6].piece = this;
                board[this.rank-1][this.file-1].piece = null;
                board[move.i][move.j].piece = null;
                this.file = 7;
            }
        }
        else super.moveToCheck(board,move);
    }

    moveToReal(board: Board,move: Move): void {
        if(move.special === 'castling')
            (board[move.i][move.j].piece as Rook).hasMoved = true;
        this.moveToCheck(board,move);
        this.hasMoved = true;
    }
}