import type { Piece } from "./pieces/piece.js";

// Board & Game Types & Functions

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

export interface Move {
    i: number,
    j: number,
    special?: 'enPassant' | 'promote' | 'castling',
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
