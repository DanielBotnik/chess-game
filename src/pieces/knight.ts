import type { Board, Move, Color } from '../types';
import { Piece } from './piece'

export class Knight extends Piece {
    
    constructor(color: Color,rank:number ,file: number){
        super(color,rank,file);
    }

    getMoves(board: Board): Array<Move> {
        let rank: number = this.rank - 1;
        let file: number = this.file - 1;
        const knightCheckMoves : Array<[number,Array<number>]> = [[rank+2,[file+1,file-1]],[rank-2,[file+1,file-1]],[rank+1,[file+2,file-2]],[rank-1,[file+2,file-2]]];
        return knightCheckMoves.map(cords => {
            if(!board[cords[0]]) return [];
            return cords[1].map(file => {
                if(board[cords[0]][file] && board[cords[0]][file].piece?.color !== this.color) {
                    return {
                        i: cords[0],
                        j: file,
                    }
                }
            })
        }).flat().filter(m => m);
    }
}