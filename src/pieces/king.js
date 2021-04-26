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
        if(!this.hasMoved){
            if(board[rank][7].piece?.constructor?.name === 'Rook' && !board[rank][7].piece.hasMoved
            && !board[rank][6].piece && !board[rank][6].piece)
                moves.push({
                    i: rank,
                    j: 7,
                });
            if(board[rank][0].piece?.constructor?.name === 'Rook' && !board[rank][0].piece.hasMoved &&
            !board[rank][1].piece && !board[rank][2].piece && !board[rank][3].piece)
                moves.push({
                    i: rank,
                    j: 0,
                });
        }
        return moves;
    }

    isChecked(board) {
        var rank = this.rank - 1;
        var file = this.file - 1;        
        var up,down,left,right,leftUp,rightUp,leftDown,rightDown;
        up = down = left = right = leftUp = rightUp = leftDown = rightDown = 1;
        //Pawn is attacking
        if(this.color === 'w'){
            if(board[rank+1] && board[rank+1][file+1] && board[rank+1][file+1].piece?.color != this.color
                && board[rank+1][file+1].piece?.constructor.name === 'Pawn')
                return true;
            if(board[rank+1] && board[rank+1][file-1] && board[rank+1][file-1].piece?.color != this.color
                && board[rank+1][file-1].piece?.constructor.name === 'Pawn')
                return true;
        }
        if(this.color === 'b'){
            if(board[rank-1] && board[rank-1][file+1] && board[rank-1][file+1].piece?.color != this.color
                && board[rank-1][file+1].piece?.constructor.name === 'Pawn')
                return true;
            if(board[rank-1] && board[rank-1][file-1] && board[rank-1][file-1].piece?.color != this.color
                && board[rank-1][file-1].piece?.constructor.name === 'Pawn')
                return true;
        }
        //King is attacking
        //I Know king cannot attack but it will  make moving king to king not possible
        if(board[rank+1] && board[rank+1][file+1] && board[rank+1][file+1].piece?.color != this.color
             && board[rank+1][file+1].piece?.constructor.name === 'King')
            return true;
        if(board[rank+1] && board[rank+1][file] && board[rank+1][file].piece?.color != this.color
             && board[rank+1][file].piece?.constructor.name === 'King')
            return true;
        if(board[rank+1] && board[rank+1][file-1] && board[rank+1][file-1].piece?.color != this.color
             && board[rank+1][file-1].piece?.constructor.name === 'King')
            return true;
        if(board[rank][file+1] && board[rank][file+1].piece?.color != this.color
             && board[rank][file+1].piece?.constructor.name === 'King')
            return true;
        if(board[rank][file-1] && board[rank][file-1].piece?.color != this.color
             && board[rank][file-1].piece?.constructor.name === 'King')
            return true;
        if(board[rank-1] && board[rank-1][file+1] && board[rank-1][file+1].piece?.color != this.color
             && board[rank-1][file+1].piece?.constructor.name === 'King')
            return true;
        if(board[rank-1] && board[rank-1][file] && board[rank-1][file].piece?.color != this.color
             && board[rank-1][file].piece?.constructor.name === 'King')
            return true;
        if(board[rank-1] && board[rank-1][file-1] && board[rank-1][file-1].piece?.color != this.color
             && board[rank-1][file-1].piece?.constructor.name === 'King')
            return true;
        //Rook \ Queen is attacking
        while(board[rank+up]) {
            if(board[rank+up][file].piece){
                if(board[rank+up][file].piece.color === this.color)
                    break;                
                if(['Queen','Rook'].includes(board[rank+up][file].piece.constructor.name))
                    return true;
                break;
            }
            up++;
        }
        while(board[rank-down]) {
            if(board[rank-down][file].piece){
                if(board[rank-down][file].piece.color === this.color)
                    break;
                if(['Queen','Rook'].includes(board[rank-down][file].piece.constructor.name))
                    return true;
                break;
            }
            down++;
        }
        while(board[rank][file+left]) {
            if(board[rank][file+left].piece) {
                if(board[rank][file+left].piece.color === this.color)
                    break;
                if(['Queen','Rook'].includes(board[rank][file+left].piece.constructor.name))
                    return true;
                break;
            }
            left++;
        }
        while(board[rank][file+right]) {
            if(board[rank][file+right].piece) {
                if(board[rank][file+right].piece.color === this.color)
                    break;
                if(['Queen','Rook'].includes(board[rank][file+right].piece.constructor.name))
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
                if(['Queen','Bishop'].includes(board[rank+rightUp][file+rightUp].piece.constructor.name))
                    return true;
                break;
            }
            rightUp++;
        }
        while(board[rank+leftUp] && board[rank+leftUp][file-leftUp]){
            if(board[rank+leftUp][file-leftUp].piece) {
                if(board[rank+leftUp][file-leftUp].piece.color === this.color)
                    break;
                if(['Queen','Bishop'].includes(board[rank+leftUp][file-leftUp].piece.constructor.name))
                    return true;
                break;
            }
            leftUp++;
        }
        while(board[rank-rightDown] && board[rank-rightDown][file+rightDown]){
            if(board[rank-rightDown][file+rightDown].piece) {
                if(board[rank-rightDown][file+rightDown].piece.color === this.color)
                    break;
                if(['Queen','Bishop'].includes(board[rank-rightDown][file+rightDown].piece.constructor.name))
                    return true;
                break;
            }
            rightDown++;
        }
        while(board[rank-leftDown] && board[rank-leftDown][file-leftDown]){
            if(board[rank-leftDown][file-leftDown].piece) {
                if(board[rank-leftDown][file-leftDown].piece.color === this.color)
                    break;
                if(['Queen','Bishop'].includes(board[rank-leftDown][file-leftDown].piece.constructor.name))
                    return true;
                break;
            }
            leftDown++;
        }
        return (board[rank+2] && board[rank+2][file+1] && board[rank+2][file+1].piece?.color != this.color
             && board[rank+2][file+1].piece?.constructor.name === 'Knight') ||
        (board[rank+2] && board[rank+2][file-1] && board[rank+2][file-1].piece?.color != this.color
             && board[rank+2][file-1].piece?.constructor.name === 'Knight') ||
        (board[rank-2] && board[rank-2][file+1] && board[rank-2][file+1].piece?.color != this.color
             && board[rank-2][file+1].piece?.constructor.name === 'Knight') ||
        (board[rank-2] && board[rank-2][file-1] && board[rank-2][file-1].piece?.color != this.color
             && board[rank-2][file-1].piece?.constructor.name === 'Knight') ||
        (board[rank+1] && board[rank+1][file+2] && board[rank+1][file+2].piece?.color != this.color
             && board[rank+1][file+2].piece?.constructor.name === 'Knight') ||
        (board[rank-1] && board[rank-1][file+2] && board[rank-1][file+2].piece?.color != this.color
             && board[rank-1][file+2].piece?.constructor.name === 'Knight') ||
        (board[rank+1] && board[rank+1][file-2] && board[rank+1][file-2].piece?.color != this.color
             && board[rank+1][file-2].piece?.constructor.name === 'Knight') ||
        (board[rank-1] && board[rank-1][file-2] && board[rank-1][file-2].piece?.color != this.color
             && board[rank-1][file-2].piece?.constructor.name === 'Knight');
    }

    moveToCheck(board,move){
        if(board[move.i][move.j].piece?.color === this.color && board[move.i][move.j].piece.constructor.name === 'Rook'){
            if(move.j === 0){
                board[move.i][move.j].piece.file = 5; 
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

    moveToReal(board,move){
        this.hasMoved = true;
        super.moveToReal(board,move);
    }
}