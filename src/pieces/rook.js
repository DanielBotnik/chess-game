export class Rook {
    constructor(color,rank,file){
        this.color = color;
        this.rank = rank;
        this.file = file;
        this.type = 'rook';
        this.hasMoved = false;
    }
    
    getMoves(board) {
        var rank = this.rank - 1;
        var file = this.file - 1;
        var moves = [];
        var up, down, left, right;
        up = down = left = right = 1;
        var moveDirection = this.color === 'w' ? 1 : -1;
        while(!board[rank+up*moveDirection][file]?.piece){
            moves.push({
                i:rank+up,
                j:file,
            });
            up++;
            //console.log(moves);
        }
        if(board[rank+up][file]?.piece &&
            board[rank+up][file].piece.color != this.color){
                moves.push({
                    i:rank+up,
                    j:file
                });
        }
        return moves;
    }
}