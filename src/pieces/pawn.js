export class Pawn {
    constructor(color,rank,file) {
        this.color = color;
        this.rank = rank;
        this.file = file;
        this.type = 'pawn';
        this.hasMoved = false;
    }

    getMoves(board){
        var moves = [(this.rank-2)*8 + (this.file - 1)];
        if(!this.hasMoved){
            moves.push((this.file - 1) + (this.rank-3) * 8);
        }
        return moves;
    }
}