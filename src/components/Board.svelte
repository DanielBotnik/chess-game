<script defer lang="ts">

    import { onMount } from "svelte";
    import { Bishop } from "../pieces/bishop";
    import { Knight } from "../pieces/knight";
    import { Pawn } from '../pieces/pawn';
    import { Queen } from "../pieces/queen";
    import { Rook } from "../pieces/rook";
    import { King } from "../pieces/king";
    import type { Piece } from "../pieces/piece";
    import type { Board, BoardType, Cell, FullMove, Move } from '../types';
    import { Color, reverseColor, colorFullName } from "../types";
    import { Sounds, START_FEN } from '../constants';
    import type Clock from "./Clock.svelte";
    import store from "../store";

    export let clock: Clock | undefined = undefined;

    export const boardType: BoardType | undefined = undefined;

    export var size;

    let board: HTMLDivElement = null;
    let boardSide: Color = Color.White;
    let currentTurn: Color = Color.White;
    let clickedCell: Cell = null;
    let pawnPromoting: Pawn = null;
    let possibleMoveCells: Array<Cell> = [];
    let promotingCells: Array<Cell> = [];
    let blackPieces: Array<Piece> = [];
    let whitePieces: Array<Piece> = [];
    let blackKing: King = null;
    let whiteKing: King = null;
    let cells: Board = [];
    let enPassantPawn: Pawn = null;


    //returns if there was a capture between the fens
    export function changeBoard(fen: string): boolean {
        let oldNumOfPieces: number = blackPieces.length + whitePieces.length;
        changeBoardByFEN(fen);
        clearPossibleMoves();
        clearPromotingMoves();
        if(clickedCell)
            clickedCell.clicked = false;
        clickedCell = null;
        getPieceCell(whiteKing).checked = isKingChecked(Color.White);
        getPieceCell(blackKing).checked = isKingChecked(Color.Black);
        return blackPieces.length + whitePieces.length !== oldNumOfPieces;
    }

    document.onkeypress = function(event) {
        if(typeof event) {
            if(event.keyCode === 101) {
                rotateBoard();
            }
        }
    }

    onMount(() => {
        board.style.width = `calc(${size}vmin + 2px)`;
        board.style.height = `calc(${size}vmin + 2px)`;
        Array.from({length: 8},(_) => {
            cells.push(Array<Cell>());
        });
        Array.from({length: 8},(_,i) => {
            Array.from({length: 8},(_,j) => {
                cells[7-i].push({
                    rank: i+1,
                    file: j+1,
                    color: (i+j) % 2 === 0 ? Color.Black: Color.White,
                    piece: null,
                    clicked: false,
                    possibleMove: false,
                    checked: false,
                    promote: null,

                });
            });
        });
        cells.reverse();
        // This is the must stupidest line of code I've ever written
        cells=cells;
        initBoard();
    });

    function numberToLetter(num: number): string {
        return String.fromCharCode(96 + num);
    }

    function letterToNumber(letter: string): number {
        return letter.charCodeAt(0) - 96;
    }

    function initBoard(): void {
        changeBoardByFEN(START_FEN);
    }

    function clearPossibleMoves(): void {
        for(let cell of possibleMoveCells) {
            cell.possibleMove = false;
        }
        possibleMoveCells.length = 0;
        if(clickedCell) {
            clickedCell.clicked = false;
            clickedCell = null;
        }
        cells = cells;
    }

    function clearPromotingMoves(): void {
        for(let cell of promotingCells) {
            cell.promote = null;
        }
        if(pawnPromoting) {
            getPieceCell(pawnPromoting).piece = pawnPromoting;
            pawnPromoting = null;
        }
    }

    function getPieceType(piece: Piece): string {
        return piece.constructor.name.toLowerCase();
    }

    function onCellClick(cell: Cell): void {
        if(cell.promote) {
            promotePiece(cell);
            return;
        }
        if(clickedCell === cell) {
            clearPossibleMoves();
            return;
        }
        if(cell.possibleMove){
            movePieceTo(clickedCell,cell);
            clearPossibleMoves();
            if(clickedCell) {
                clickedCell.clicked = false;
            }
        }
        else {
            clearPossibleMoves();
            if(pawnPromoting) {
                clearPromotingMoves();
                return;
            }
            if(clickedCell) {
                clickedCell.clicked = false; 
            }
            if(!cell.piece || cell.clicked)
                clickedCell = null;
            else {
                if(cell.piece.color !== currentTurn) return;
                clickedCell = cell;
                showMoves(cell);
            }
        }
        cells = cells;
    }

    function showMoves(cell: Cell): void {
        for(let move of cell.piece.getMoves(cells)) {
            if(isMoveLegal(cell,move)) {
                cells[move.rank][move.file].possibleMove = true;
                possibleMoveCells.push(cells[move.rank][move.file]);
            }
        }
    }

    function isMoveLegal(cell: Cell,move: Move): boolean {
        let pieceBefore: Piece = cells[move.rank][move.file]?.piece;
        if(pieceBefore && move.special !== 'castling') {
            removePiece(pieceBefore);
        }
        let pieceMoved: Piece = cell.piece;
        cell.piece.moveToCheck(cells,move);
        let res: boolean = !isKingChecked(pieceMoved.color);
        if(move.special === 'castling') {
            if(move.file === 7){
                pieceMoved.moveToCheck(cells,{
                    rank:  pieceMoved.rank-1,
                    file:  4,
                });
                pieceBefore.file = 8;
                cells[pieceMoved.rank-1][6].piece = null;
                cells[pieceMoved.rank-1][5].piece = null;
            }
            else {
                pieceMoved.moveToCheck(cells,{
                    rank: pieceMoved.rank-1,
                    file: 4,
                });
                pieceBefore.file = 1;
                cells[pieceMoved.rank-1][3].piece = null;
                cells[pieceMoved.rank-1][2].piece = null;
            }
        }
        else if(move.special === 'enPassant') {
            pieceMoved.moveToCheck(cells, {
                rank: cell.rank-1,
                file: cell.file-1,
            });
        }
        else {
            cells[move.rank][move.file].piece.moveToCheck(cells,{
                rank: cell.rank-1,
                file: cell.file-1,
            });
        }
        cells[move.rank][move.file].piece = pieceBefore;

        if(pieceBefore) {
            addPiece(pieceBefore);
        }
        return res;
        
    }

    function isKingChecked(color: Color): boolean{
        const kingToCheck = color === Color.White ? whiteKing: blackKing;
        return kingToCheck.isChecked(cells);
    }


    function makeAMove(pieceCell: Cell, dest: Cell): string {
        let type: string = ''
        let file: string = String.fromCharCode(dest.file+96)
        let rank: number = dest.rank
        switch(getPieceType(pieceCell.piece)) {
            case "rook":
                type="♖"
            break;
            case "bishop":
                type="♗"
            break;
            case "knight":
                type="♘"
            break;
            case "queen":
                type="♕"
            break;
            case "king":
                type="♔"
            break;
        }
        return(type+file+rank)
    }

    function createFEN(): string {
        let empty: number = 0
        let fen: string = ''
        for(let i = 7 ; i >= 0 ; i--){
            for(let j = 0 ; j < 8 ; j++){
                if (!cells[i][j].piece) {
                    empty++
                } else {
                    if (empty > 0) {
                        fen += empty
                        empty = 0
                    }
                    let color: Color = cells[i][j].piece.color
                    let pieceType: string = getPieceType(cells[i][j].piece);
                    let piece: string = pieceType === 'knight' ? 'n': pieceType.charAt(0);

                    fen += color === Color.White ? piece.toUpperCase(): piece.toLowerCase()
                }
            }

            if (empty > 0) 
                fen += empty
            fen += '/'
            empty = 0
        }
        fen = fen.slice(0,-1);
        let castlingRights: string = '';
        if(!whiteKing.hasMoved) {
            if(cells[0][7].piece instanceof Rook && cells[0][7].piece.hasMoved) castlingRights += 'K';
            if(cells[0][0].piece instanceof Rook && cells[0][0].piece.hasMoved) castlingRights += 'Q';
        }
        if(!blackKing.hasMoved) {
            if(cells[7][7].piece instanceof Rook && cells[7][7].piece.hasMoved) castlingRights += 'k';
            if(cells[7][0].piece instanceof Rook && cells[7][0].piece.hasMoved) castlingRights += 'q';
        }
        castlingRights = castlingRights || '-';
        fen += ` ${currentTurn} ${castlingRights}`;
        return(fen)
    }

    function changeBoardByFEN(fen: string): void {
        let increase: number = 0;
        whitePieces.length = 0;
        blackPieces.length = 0;
        let segments: string[] = fen.split(' ');
        for(let i = 7 ; i >= 0 ; i--){
            for(let j = 0 ; j < 8 ; j++){
                switch (segments[0].charAt(0)) {
                    case 'p':
                       cells[i][j].piece = new Pawn(Color.Black,i+1,j+1);
                    break;
                    case 'P':
                       cells[i][j].piece = new Pawn(Color.White,i+1,j+1);
                    break;
                    case 'r':
                       cells[i][j].piece = new Rook(Color.Black,i+1,j+1);
                    break;
                    case 'R':
                       cells[i][j].piece = new Rook(Color.White,i+1,j+1);
                    break;
                    case 'n':
                       cells[i][j].piece = new Knight(Color.Black,i+1,j+1);
                    break;
                    case 'N':
                       cells[i][j].piece = new Knight(Color.White,i+1,j+1);
                    break;
                    case 'b':
                       cells[i][j].piece = new Bishop(Color.Black,i+1,j+1);
                    break;
                    case 'B':
                       cells[i][j].piece = new Bishop(Color.White,i+1,j+1);
                    break;
                    case 'q':
                       cells[i][j].piece = new Queen(Color.Black,i+1,j+1);
                    break;
                    case 'Q':
                       cells[i][j].piece = new Queen(Color.White,i+1,j+1);
                    break;
                    case 'k':
                       cells[i][j].piece = new King(Color.Black,i+1,j+1);
                       blackKing = cells[i][j].piece as King;
                    break;
                    case 'K':
                       cells[i][j].piece = new King(Color.White,i+1,j+1);
                       whiteKing = cells[i][j].piece as King;
                    break;
                    default:
                        cells[i][j].piece = null;
                        increase = Number(segments[0].charAt(0));
                        increase--;
                        segments[0] = increase + segments[0].substring(1);
                    break;
                }
                if(cells[i][j].piece) {
                    addPiece(cells[i][j].piece);
                }
                if (!increase)
                    segments[0] = segments[0].substring(1);
            }
            segments[0] = segments[0].substring(1);
        }
        currentTurn = segments[1] as Color;
        let castlingRights: string = segments[2] as string;
        if(castlingRights.includes('K')) {
            whiteKing.hasMoved = false;
            (cells[0][7].piece as Rook).hasMoved = false;
        }
        if(castlingRights.includes('Q')) {
            whiteKing.hasMoved = false;
            (cells[0][0].piece as Rook).hasMoved = false;
        }
        if(castlingRights.includes('k')) {
            blackKing.hasMoved = false;
            (cells[7][7].piece as Rook).hasMoved = false;
        }
        if(castlingRights.includes('q')) {
            blackKing.hasMoved = false;
            (cells[7][0].piece as Rook).hasMoved = false;
        }
    }

    
    store.onMoveRecived((move: FullMove) => {
        if(!move)
            return;
        console.log(move);
        let moveValue = makeAMove(cells[move.from_rank][move.from_file],cells[move.to_rank][move.to_file]);
        let sound: Sounds = Sounds.MOVE;
        let pieceMoving: Piece = cells[move.from_rank][move.from_file].piece;
        let capturedPiece: Piece = cells[move.to_rank][move.to_file].piece; // Could be null / undefined if no piece was captured.
        if(pieceMoving.color === Color.White)
            getPieceCell(whiteKing).checked = false;
        else
            getPieceCell(blackKing).checked = false;
        if(pieceMoving instanceof Pawn && move.from_file != move.to_file && enPassantPawn && !move.promote) {
            removePiece(enPassantPawn);
            sound = Sounds.CAPTURE;
        }
        else if(capturedPiece) {
            removePiece(capturedPiece);
            sound = Sounds.CAPTURE;
        }
        //TODO: Check if special field can be inherited from FullMove
        pieceMoving.moveToReal(cells,{
            rank: move.to_rank,
            file: move.to_file,
            special: pieceMoving.color === capturedPiece?.color ? 'castling' : null
        });
        //TOOD: Check if the "if" is required, aswell the line below.
        if(enPassantPawn && enPassantPawn !== pieceMoving)
            enPassantPawn.enPassant = false;
        if(move.promote) {
            removePiece(pieceMoving);
            let newPiece: Piece = null;
            switch(move.promote) {
                case 'q':
                    newPiece = new Queen(pieceMoving.color,pieceMoving.rank,pieceMoving.file);
                    break;
                case 'r':
                    newPiece = new Rook(pieceMoving.color,pieceMoving.rank,pieceMoving.file);
                    break;
                case 'b':
                    newPiece = new Bishop(pieceMoving.color,pieceMoving.rank,pieceMoving.file);
                    break;
                case 'n':
                    newPiece = new Knight(pieceMoving.color,pieceMoving.rank,pieceMoving.file);
                    break;
            }
            addPiece(newPiece);
            pieceMoving = newPiece;
            cells[pieceMoving.rank - 1][pieceMoving.file - 1].piece = pieceMoving;
        }
        enPassantPawn = pieceMoving instanceof Pawn && pieceMoving.enPassant ? pieceMoving: null;
        if(isKingChecked(reverseColor(pieceMoving.color))){
            let checkedKing: King = pieceMoving.color === Color.Black ? whiteKing : blackKing;
            cells[checkedKing.rank-1][checkedKing.file-1].checked = true;
            if(isCheckMate(checkedKing.color)) {
                sound = Sounds.CHECKMATE;
            }
        }
        const audio: HTMLAudioElement = new Audio(sound.toString());
        audio.play();
        currentTurn = reverseColor(currentTurn);
        clock.addMove(pieceMoving.color,moveValue,createFEN());
        cells = cells;
    });

    function movePieceTo(pieceMovingCell: Cell,moveToCell: Cell){
        let moveValue = makeAMove(pieceMovingCell,moveToCell)
        let pieceMoving: Piece = pieceMovingCell.piece;
        let sound: Sounds;
        //Removing check class from checked king ,if king moved he cannot be in check ;-)
        if(pieceMoving.color === Color.White)
            getPieceCell(whiteKing).checked = false;
        else
            getPieceCell(blackKing).checked = false;
        //Handle Promotion
        if(pieceMoving instanceof Pawn && 
        ((pieceMoving.color === Color.Black && moveToCell.rank === 1) || (pieceMoving.color === Color.White && moveToCell.rank === 8))) {
            let movingDirection: number = pieceMoving.color === Color.White ? -1: 1;
            pawnPromoting = pieceMoving as Pawn;
            getPieceCell(pieceMoving).piece = null;
            for(let i = 0; i < 4 ; i++) {
                promotingCells.push(cells[moveToCell.rank-1+movingDirection * i][moveToCell.file - 1]);
                cells[moveToCell.rank-1+movingDirection * i][moveToCell.file-1].promote = pawnPromoting.color;
            }
            return;
        }
        if(pieceMoving instanceof Pawn && moveToCell.file != pieceMoving.file && !moveToCell.piece){
            removePiece(enPassantPawn);
            sound = Sounds.CAPTURE;
        }
        else if(moveToCell.piece && pieceMoving.color != moveToCell.piece.color) {
            removePiece(moveToCell.piece);
            sound = Sounds.CAPTURE;
        }
        else {
            sound = Sounds.MOVE;
        }
        pieceMoving.moveToReal(cells,{
            rank: moveToCell.rank-1,
            file: moveToCell.file-1,
            special: pieceMoving.color === moveToCell.piece?.color ? 'castling': null,
        });
        if(enPassantPawn && enPassantPawn !== pieceMoving)
            enPassantPawn.enPassant = false;
        enPassantPawn = pieceMoving instanceof Pawn && pieceMoving.enPassant ? pieceMoving: null;
        if(isKingChecked(reverseColor(pieceMoving.color))){
            let checkedKing: King = pieceMoving.color === Color.Black ? whiteKing : blackKing;
            cells[checkedKing.rank-1][checkedKing.file-1].checked = true;
            if(isCheckMate(checkedKing.color)) {
                sound = Sounds.CHECKMATE;
            }
        }
        new Audio(sound.toString()).play();
        currentTurn = reverseColor(currentTurn);
        clock.addMove(pieceMoving.color, moveValue, createFEN());
        cells = cells;
        store.sendMoveToServer({
            from_file: pieceMovingCell.file-1,
            from_rank: pieceMovingCell.rank-1,
            to_file: moveToCell.file-1,
            to_rank: moveToCell.rank-1,
        });
    }

    function getPieceCell(piece: Piece): Cell {
        return cells[piece.rank-1][piece.file-1];
    }

    function removePiece(piece: Piece): void {
        if(piece.color === Color.White)
            whitePieces = whitePieces.filter(p => p !== piece);
        else
            blackPieces = blackPieces.filter(p => p !== piece);
        getPieceCell(piece).piece = null;
    }

//     //Is the color checked, for example if isCheckMate(Color.White) === True ==> Black won
    function isCheckMate(color: Color): boolean {
        let piecesToCheck: Array<Piece> = color === Color.White ? whitePieces: blackPieces;
        for(let piece of piecesToCheck) {
            if(piece.getMoves(cells).filter(move => isMoveLegal(getPieceCell(piece),move)).length)
                return false;
        }
        return true;
    }

    function promotePiece(cell: Cell): void {
        const promoteTo: string = '_qnrbbrnq'[cell.rank];
        const file: number = cell.file;
        let pieceAfterPromote: Piece = null;
        let promoteRank: number = pawnPromoting.color === Color.White ? 8 : 1;
        switch(promoteTo) {
            case 'q':
                pieceAfterPromote = new Queen(pawnPromoting.color,promoteRank,file);
                break;
            case 'n':
                pieceAfterPromote = new Knight(pawnPromoting.color,promoteRank,file);
                break;
            case 'r':
                pieceAfterPromote = new Rook(pawnPromoting.color,promoteRank,file);
                break;
            case 'b':
                pieceAfterPromote = new Bishop(pawnPromoting.color,promoteRank,file);
                break;
        }
        const oldPawnFile: number = pawnPromoting.file;
        const oldPawnRank: number = pawnPromoting.rank;
        removePiece(pawnPromoting);
        if(pawnPromoting.color === Color.White)
            addPiece(pieceAfterPromote);
        pawnPromoting = null;
        let audio: HTMLAudioElement = null;
        if(cells[promoteRank-1][file-1].piece) {
            removePiece(cells[promoteRank-1][file-1].piece);
            audio = new Audio(Sounds.CAPTURE);
        }
        cells[promoteRank-1][file-1].piece = pieceAfterPromote;
        if(isKingChecked(reverseColor(pieceAfterPromote.color))) {
            let checkedKing: King = pieceAfterPromote.color === Color.Black ? whiteKing : blackKing;
            getPieceCell(checkedKing).checked = true;
            if(isCheckMate(reverseColor(pieceAfterPromote.color))) {
                audio = new Audio(Sounds.CHECKMATE);
            }
        }
        if(!audio)
            audio = new Audio(Sounds.MOVE);
        audio.play();
        clearPromotingMoves();
        clearPossibleMoves();
        cells = cells;
        currentTurn = reverseColor(currentTurn);
        //TODO: maybe find better fix
        setTimeout(() => {
            clearPossibleMoves();
            cells = cells;
        }, 0);
        store.sendMoveToServer({
            from_file: oldPawnFile-1,
            from_rank: oldPawnRank-1,
            to_file: cell.file-1,
            to_rank: cell.rank-1,
            promote: promoteTo
        });
    }

    function cleanBoard(): void {
        whitePieces.length = 0;
        blackPieces.length = 0;
        for(let i = 0 ; i < 8 ; i++)
            for(let j = 0 ; j < 8 ; j++)
                cells[i][j].piece = null;
        blackKing = null;
        whiteKing = null;
    }

    function addPiece(piece: Piece): void {
        if(piece.color === Color.White)
            whitePieces.push(piece);
        else
            blackPieces.push(piece);
    }

    export function rotateBoard(): void {
        clearPossibleMoves();
        clearPromotingMoves();
        boardSide = reverseColor(boardSide);
    }

    export function setColor(c: Color): void {
        currentTurn = c;
    }

    export function movePieceByServer(res){
        movePieceTo(cells[res.originRank-1][res.originFile-1],cells[res.destRank-1][res.destFile-1]);
    }

    export function setClock(c: Clock) {
        clock = c;
    }

</script>


<div class='board' bind:this={board}>
    {#each boardSide === Color.White ? [...cells].reverse(): cells as row}
        {#each boardSide === Color.White ? row
: [...row].reverse() as cell}
        <div class={`${colorFullName(cell.color)}cell`} 
            class:whitecellclicked={cell.clicked && cell.color === Color.White}
            class:blackcellclicked={cell.clicked && cell.color === Color.Black} on:click={() => onCellClick(cell)}>
            {#if cell.promote}
                <span class='promote-cell'></span>
                {#if [1,8].includes(cell.rank)}
                    <img class='piecesvg-promote' src='images/{cell.promote}_queen.svg' alt=''/>
                {:else if [2,7].includes(cell.rank)}
                    <img class='piecesvg-promote' src='images/{cell.promote}_knight.svg' alt=''/>
                {:else if [3,6].includes(cell.rank)}
                    <img class='piecesvg-promote' src='images/{cell.promote}_rook.svg' alt=''/>
                {:else if [4,5].includes(cell.rank)}
                    <img class='piecesvg-promote' src='images/{cell.promote}_bishop.svg' alt=''/>
                {/if}
            {:else if cell.piece}
                <img class='piecesvg' src='images/{cell.piece.color}_{getPieceType(cell.piece)}.svg' alt=''>
            {/if}
            {#if (cell.rank === 1 && boardSide === Color.White) || (cell.rank === 8 && boardSide === Color.Black)}
                <span class='filenumber'>
                    {numberToLetter(cell.file)}        
                </span>
            {/if}
            {#if (cell.file === 8 && boardSide === Color.White) || (cell.file === 1 && boardSide === Color.Black)}
                <span class='ranknumber'>
                    {cell.rank}
                </span>
            {/if}
            {#if cell.possibleMove}
                <span class={cell.piece ? 'piece-possible-move': 'move-location'}></span>
            {/if}
            {#if cell.checked}
                <span class='location-check'></span>
            {/if}
        </div>
        {/each}
    {/each}
</div>


<style type="scss">
    
    $blackColor: #B58863;
    $whiteColor: #FDE9C1;
    $whiteColorClicked: #B5FD90;
    $blackColorClicked: #D3AAEF;
    $moveLocation: black;
    $promoteBackgroundColor: #AAAAAA;
    
    .board {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
        border: 2px solid #B58863;
        display:grid;
        grid-template-columns: repeat(8,1fr);
        grid-template-rows: repeat(8,1fr);
    }

    .whitecell {
        display:flex;
        justify-content: center;
        align-items: center;
        background-color: $whiteColor;
        position: relative;
        
        span {
            color: $blackColor;
        }

        .move-location {
            height: 35%;
            width: 35%;
            border-radius: 50%;
            background: $whiteColorClicked;

            
        }

        .piece-possible-move {
            height:100%;
            width:100%;
            position:absolute;
            background: radial-gradient(transparent 0%, transparent 79%, $whiteColorClicked);
        }
    
    }

    .blackcell {
        display:flex;
        justify-content: center;
        align-items: center;
        background-color: $blackColor;
        position: relative;
        
        span {
            color: $whiteColor;
        }

        .move-location {
            height: 35%;
            width: 35%;
            border-radius: 50%;
            background: $blackColorClicked;
        }

        .piece-possible-move {
            height:100%;
            width:100%;
            position:absolute;
            background: radial-gradient(transparent 0%, transparent 79%, $blackColorClicked);
        }

    }

    .whitecell.clicked {
            background-color: $whiteColorClicked;
    }

    .blackcell.clicked {
        background-color: $blackColorClicked;
    }

    .filenumber {
        position: absolute;
        bottom:0.2vmin;
        left:0.4vmin;
        font-size:2vmin;
    }

    .ranknumber {
        position: absolute;
        right: 0.4vmin;
        top: 0.3vmin;
        font-size: 2vmin;
    }

    .piecesvg {
        min-height: 100%;
        min-width: 100%;
        z-index: 1;
    }

    .location-check {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 0;
        background: radial-gradient(ellipse at center, rgb(250, 75, 75) 0%, #e70000 25%, rgba(169,0,0,0) 89%, rgba(158,0,0,0) 100%);
    }

    .promote-cell {
        position: absolute;
        min-width: 100%;
        min-height: 100%;
        background-color: $promoteBackgroundColor;
        border-radius: 50%;
        box-shadow: inset 10px 10px 25px 3px #808080;

    }

    .move-location {
        height: 35%;
        width: 35%;
        border-radius: 50%;
        background:black;
    }
    
    .piecesvg-promote {
        min-height: 100%;
        min-width: 100%;
        transform: scale(0.75);
    }

   :global(.promotion-cell) {
        background-color: black;
    }

</style>
