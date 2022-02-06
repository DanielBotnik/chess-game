import type { Board, Move, Color } from '../types';
import { Piece } from './piece'

export class Queen extends Piece{
    
    constructor(color: Color,rank: number,file: number) {
        super(color,rank,file);
    }

    getMoves(board: Board): Array<Move> {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;
        let moves: Array<Move> = [];
        let up: number,down: number,left: number,right: number,leftUp: number,rightUp: number,leftDown: number,rightDown: number;
        up = down = left = right = leftUp = rightUp = leftDown = rightDown = 1;
        while(board[rank+up] && !board[rank+up][file].piece){
            moves.push({
                i:rank+up,
                j:file,
            });
            up++;
        }
        if(board[rank+up] && board[rank+up][file].piece &&
            board[rank+up][file].piece.color != this.color){
                moves.push({
                    i:rank+up,
                    j:file
                });
        }
        while(board[rank-down] && !board[rank-down][file].piece){
            moves.push({
                i:rank-down,
                j:file,
            });
            down++;
        }
        if(board[rank-down] && board[rank-down][file].piece &&
            board[rank-down][file].piece.color != this.color){
                moves.push({
                    i:rank-down,
                    j:file
                });
        }
        while(board[rank][file+left] && !board[rank][file+left].piece){
            moves.push({
                i:rank,
                j:file+left,
            });
            left++;
        }
        if(board[rank][file+left] && board[rank][file+left].piece &&
            board[rank][file+left].piece.color != this.color){
                moves.push({
                    i:rank,
                    j:file+left
                });
        }
        while(board[rank][file-right] && !board[rank][file-right].piece){
            moves.push({
                i:rank,
                j:file-right,
            });
            right++;
        }
        if(board[rank][file-right] && board[rank][file-right].piece &&
            board[rank][file-right].piece.color != this.color){
                moves.push({
                    i:rank,
                    j:file-right
                });
        }
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