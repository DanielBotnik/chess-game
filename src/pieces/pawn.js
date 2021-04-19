export class Pawn {
    
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
        var moveDirection = this.color === 'w' ? 1 : -1;
        if(!board[rank+moveDirection][file].piece){
            moves.push({
                i: rank+moveDirection,
                j: file,
            });
        }
        if(!this.hasMoved && !board[rank+moveDirection*2][file].piece){
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
        return moves;
    }
}