import type { Piece } from "./pieces/piece.js";

// Board & Game Types & Functions

export const enum BoardType {
    AGINST_PLAYER,
    AGINST_YOURSELF,
}

export const enum Color {
    White = 'w',
    Black = 'b',
}

export interface Cell {
    rank: number,
    file: number,
    color: Color,
    piece: Piece,
    clicked: boolean,
    possibleMove: boolean,
    checked: boolean,
    promote: Color,
}

// both file and rank start at 0. and represented as numbers
export type Move = {
    file: number,
    rank: number,
    special?: 'enPassant' | 'promote' | 'castling',
}

export type FullMove = {
    from_file: number,
    from_rank: number,
    to_file: number,
    to_rank: number,
    special?: 'enPassant' | 'promote' | 'castling',
    promote?: string //'queen' | 'rook' | 'bishop' | 'knight',
}

export type Board = Array<Array<Cell>>;

export function colorFullName(color: Color) : 'white' | 'black' {
    return color === Color.White ? 'white' : 'black';
}

export function reverseColor(color: Color): Color {
    return color === Color.White ? Color.Black : Color.White;
}

// Chat Types

export type ChatMessage = {
    sender: string,
    content: string,
}
