import type { Board, Move, Color } from '../types';
import { Piece } from './piece'

export class Bishop extends Piece {
    
    constructor(color: Color, rank: number, file: number){
        super(color,rank,file);
    }

    getMoves(board: Board) : Array<Move> {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;
        let moves: Array<Move> = [];
        let leftUp: number = 1,rightUp: number = 1,leftDown: number = 1,rightDown: number = 1;
        //TODO: Check if === null can be removed.
        while(board[rank+rightUp] && board[rank+rightUp][file+rightUp]?.piece === null){
            moves.push({
                i: rank+rightUp,
                j: file+rightUp,
            });
            rightUp++;
        }
        if(board[rank+rightUp] && board[rank+rightUp][file+rightUp]?.piece
            && board[rank+rightUp][file+rightUp].piece.color != this.color){
                moves.push({
                    i: rank+rightUp,
                    j: file+rightUp,
                });
        }
        while(board[rank+leftUp] && board[rank+leftUp][file-leftUp]?.piece === null){
            moves.push({
                i: rank+leftUp,
                j: file-leftUp,
            });
            leftUp++;
        }
        if(board[rank+leftUp] && board[rank+leftUp][file-leftUp]?.piece
            && board[rank+leftUp][file-leftUp].piece.color != this.color){
                moves.push({
                    i: rank+leftUp,
                    j: file-leftUp,
                });
        }
        while(board[rank-rightDown] && board[rank-rightDown][file+rightDown]?.piece === null){
            moves.push({
                i: rank-rightDown,
                j: file+rightDown,
            });
            rightDown++;
        }
        if(board[rank-rightDown] && board[rank-rightDown][file+rightDown]?.piece
            && board[rank-rightDown][file+rightDown].piece.color != this.color){
                moves.push({
                    i: rank-rightDown,
                    j: file+rightDown,
                });
        }
        while(board[rank-leftDown] && board[rank-leftDown][file-leftDown]?.piece === null){
            moves.push({
                i: rank-leftDown,
                j: file-leftDown,
            });
            leftDown++;
        }
        if(board[rank-leftDown] && board[rank-leftDown][file-leftDown]?.piece
            && board[rank-leftDown][file-leftDown].piece.color != this.color){
                moves.push({
                    i: rank-leftDown,
                    j: file-leftDown,
                });
        }
        return moves;
    }
}
