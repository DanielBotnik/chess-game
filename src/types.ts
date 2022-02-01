import type { Piece } from "./pieces/piece.js";

export const enum SquareColor {
    White = "white",
    Black = "black"
}

export interface Cell {
    rank: number,
    file: number,
    color: SquareColor,
    piece: Piece,
    clicked: boolean,
    possibleMove: boolean,
    checked: boolean,
    promote: PieceColor | null,
}

export interface Move {
    i: number,
    j: number,
    special?: 'enPassant' | 'promote' | 'castling',
}

export enum PieceColor {
    White = 'w',
    Black = 'b',
}

export type Board = Array<Array<Cell>>;