<script defer lang="ts">

    import { onMount } from "svelte";
    import { Bishop } from "../pieces/bishop";
    import { Knight } from "../pieces/knight";
    import { Pawn } from '../pieces/pawn';
    import { Queen } from "../pieces/queen";
    import { Rook } from "../pieces/rook";
    import { King } from "../pieces/king";
    import type { Piece } from "../pieces/piece";
    import type { Board, Cell } from '../types';
    import { PieceColor } from "../types";
    import { SquareColor } from '../types'

    export var size;
    export var sendMoveToServer;

    let board = null;
    let boardSide = 'w';
    let color;
    let clickedCell: Cell = null;
    let pawnPromoting: Pawn = null;
    let possibleMoveCells: Array<Cell> = [];
    let promotingCells: Array<Cell> = [];
    let blackPieces: Array<Piece> = [];
    let whitePieces: Array<Piece> = [];
    let blackKing: King = null;
    let whiteKing: King = null;
    let cells: Board = [];
    let turn = true;
    let enPassantPawn = null;

    export var addClockMove;


    //returns if there was a capture between the fens
    export function changeBoard(fen: string): boolean {
        let oldNumOfPieces = blackPieces.length + whitePieces.length;
        changeBoardByFEN(fen);
        clearPossibleMoves();
        if(clickedCell)
            clickedCell.clicked = false;
        clickedCell = null;
        return blackPieces.length + whitePieces.length !== oldNumOfPieces;
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
                    color: (i+j) % 2 === 0 ? SquareColor.Black: SquareColor.White,
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
        initBoard(cells);
    });

    function numberToLetter(num: number): string{
        return String.fromCharCode(96 + num);
    }

    function letterToNumber(letter: string): number{
        return letter.charCodeAt(0) - 96;
    }

    function initBoard(cells: Array<Array<Cell>>): void {
        for(var i = 0 ; i < 8 ; i++) {
            cells[6][i].piece = new Pawn(PieceColor.Black,7,i+1);
            blackPieces.push(cells[6][i].piece);
            cells[1][i].piece = new Pawn(PieceColor.White,2,i+1);
            whitePieces.push(cells[1][i].piece);
        }
        cells[0][0].piece = new Rook(PieceColor.White,1,1);
        cells[0][7].piece = new Rook(PieceColor.White,1,8);
        cells[0][1].piece = new Knight(PieceColor.White,1,2);
        cells[0][6].piece = new Knight(PieceColor.White,1,7);
        cells[0][2].piece = new Bishop(PieceColor.White,1,3);
        cells[0][5].piece = new Bishop(PieceColor.White,1,6);
        cells[0][3].piece = new Queen(PieceColor.White,1,4);
        cells[0][4].piece = new King(PieceColor.White,1,5);
        whiteKing = cells[0][4].piece as King;

        cells[7][0].piece = new Rook(PieceColor.Black,8,1);
        cells[7][7].piece = new Rook(PieceColor.Black,8,8);
        cells[7][1].piece = new Knight(PieceColor.Black,8,2);
        cells[7][6].piece = new Knight(PieceColor.Black,8,7);
        cells[7][2].piece = new Bishop(PieceColor.Black,8,3);
        cells[7][5].piece = new Bishop(PieceColor.Black,8,6);
        cells[7][3].piece = new Queen(PieceColor.Black,8,4);
        cells[7][4].piece = new King(PieceColor.Black,8,5);
        blackKing = cells[7][4].piece as King;

        for(var i = 0 ; i < 8 ; i++){
            blackPieces.push(cells[7][i].piece);
            whitePieces.push(cells[0][i].piece);
        }
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
                
            if(cell.promote) {
                return;
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
                clickedCell = cell;
                showMoves(cell);
            }
        }
        cells = cells;
    }

    function showMoves(cell: Cell): void {
        for(let move of cell.piece.getMoves(cells)) {
            if(isMoveLegal(cell,move)) {
                cells[move.i][move.j].possibleMove = true;
                possibleMoveCells.push(cells[move.i][move.j]);
            }
        }
    }

    function isMoveLegal(cell,move){
        let pieceBefore = cells[move.i][move.j]?.piece;
        if(pieceBefore && move.special !== 'castling') {
            if(pieceBefore.color === 'w')
                whitePieces = whitePieces.filter((piece) => {return pieceBefore !== piece});
            else
                blackPieces = blackPieces.filter((piece) => {return pieceBefore !== piece});
        }
        var pieceMoved = cell.piece;
        cell.piece.moveToCheck(cells,move);
        var res = !isKingChecked(pieceMoved.color);
        if(move.special === 'castling') {
            if(move.j === 7){
                pieceMoved.moveToCheck(cells,{
                    i: pieceMoved.rank-1,
                    j: 4,
                });
                pieceBefore.file = 8;
                cells[pieceMoved.rank-1][6].piece = null;
                cells[pieceMoved.rank-1][5].piece = null;
            }
            else {
                pieceMoved.moveToCheck(cells,{
                    i:pieceMoved.rank-1,
                    j:4
                });
                pieceBefore.file = 1;
                cells[pieceMoved.rank-1][3].piece = null;
                cells[pieceMoved.rank-1][2].piece = null;
            }
        }
        else if(move.special === 'enPassant') {
            pieceMoved.moveToCheck(cells, {
                i:cell.rank-1,
                j:cell.file-1,
            });
        }
        else {
            cells[move.i][move.j].piece.moveToCheck(cells,{
                i: cell.rank-1,
                j: cell.file-1
            });
        }
        cells[move.i][move.j].piece = pieceBefore;

        if(pieceBefore) {
            if(pieceBefore.color === 'w')
                whitePieces.push(pieceBefore);
            else
                blackPieces.push(pieceBefore);
        }
        return res;
        
    }

    function isKingChecked(color){
        var kingToCheck = color === 'w' ? whiteKing: blackKing;
        return kingToCheck.isChecked(cells);
    }


    function makeAMove(pieceCell, dest) {
        var type = ""
        var file = String.fromCharCode(dest.file+96)
        var rank = dest.rank
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

    function createFEN() {
        var empty = 0
        var fen = ''
        for(var i = 7 ; i >= 0 ; i--){
            for(var j = 0 ; j < 8 ; j++){
                if (!cells[i][j].piece) {
                    empty++
                } else {
                    if (empty > 0) {
                        fen += empty
                        empty = 0
                    }
                    var color = cells[i][j].piece.color
                    var pieceType = getPieceType(cells[i][j].piece);
                    var piece = pieceType === 'knight' ? 'n': pieceType.charAt(0);

                    fen += color === 'w' ? piece.toUpperCase(): piece.toLowerCase()
                }
            }

            if (empty > 0) 
                fen += empty
            fen += '/'
            empty = 0
        }
        return(fen.slice(0, -1))
    }

    function changeBoardByFEN(fen) {
        let increase = 0;
        whitePieces.length = 0;
        blackPieces.length = 0;
        for(var i = 7 ; i >= 0 ; i--){
            for(var j = 0 ; j < 8 ; j++){
                switch (fen.charAt(0)) {
                    case 'p':
                       cells[i][j].piece = new Pawn(PieceColor.Black,i+1,j+1);
                    break;
                    case 'P':
                       cells[i][j].piece = new Pawn(PieceColor.White,i+1,j+1);
                    break;
                    case 'r':
                       cells[i][j].piece = new Rook(PieceColor.Black,i+1,j+1);
                    break;
                    case 'R':
                       cells[i][j].piece = new Rook(PieceColor.White,i+1,j+1);
                    break;
                    case 'n':
                       cells[i][j].piece = new Knight(PieceColor.Black,i+1,j+1);
                    break;
                    case 'N':
                       cells[i][j].piece = new Knight(PieceColor.White,i+1,j+1);
                    break;
                    case 'b':
                       cells[i][j].piece = new Bishop(PieceColor.Black,i+1,j+1);
                    break;
                    case 'B':
                       cells[i][j].piece = new Bishop(PieceColor.White,i+1,j+1);
                    break;
                    case 'q':
                       cells[i][j].piece = new Queen(PieceColor.Black,i+1,j+1);
                    break;
                    case 'Q':
                       cells[i][j].piece = new Queen(PieceColor.White,i+1,j+1);
                    break;
                    case 'k':
                       cells[i][j].piece = new King(PieceColor.Black,i+1,j+1);
                       blackKing = cells[i][j].piece as King;
                    break;
                    case 'K':
                       cells[i][j].piece = new King(PieceColor.White,i+1,j+1);
                       whiteKing = cells[i][j].piece as King;
                    break;
                    default:
                        cells[i][j].piece = null;
                        increase = Number(fen.charAt(0));
                        increase--;
                        fen = increase + fen.substring(1);
                    break;
                }
                if(cells[i][j].piece) {
                    cells[i][j].piece.color === 'w' ?
                        whitePieces.push(cells[i][j].piece):
                        blackPieces.push(cells[i][j].piece);
                }
                if (increase == 0)
                    fen = fen.substring(1);
            }
            fen = fen.substring(1);
        }
    }

    function movePieceTo(pieceMoving,moveToCell){
        let moveValue = makeAMove(pieceMoving,moveToCell)
        var audio = null;
        //Removing check class from checked king ,if king moved he cannot be in check ;-)
        if(pieceMoving.color === 'w')
            getPieceCell(whiteKing).checked = false;
        else
            getPieceCell(blackKing).checked = false;
        //Handle Promotion
        if(getPieceType(pieceMoving.piece) === 'pawn' && 
        ((pieceMoving.piece.color === 'b' && moveToCell.rank === 1) || (pieceMoving.piece.color === 'w' && moveToCell.rank === 8))) {
            var movingDirection = pieceMoving.piece.color === 'w' ? -1: 1;
            pawnPromoting = pieceMoving.piece;
            getPieceCell(pieceMoving).piece = null;
            for(var i = 0; i < 4 ; i++) {
                promotingCells.push(cells[moveToCell.rank-1+movingDirection * i][moveToCell.file - 1]);
                cells[moveToCell.rank-1+movingDirection * i][moveToCell.file-1].promote = pawnPromoting.color;
            }
            cells = cells;
            return;
        }
        if(getPieceType(pieceMoving) === 'pawn' && Math.abs(moveToCell.rank-pieceMoving.rank) === 2) {
            if(enPassantPawn)
                enPassantPawn.enPassant = false;
            enPassantPawn = pieceMoving;
        }
        if(getPieceType(pieceMoving) === 'pawn' && moveToCell.file != pieceMoving.file && !moveToCell.piece){
            removePiece(moveToCell.piece);
            cells[moveToCell.rank-(pieceMoving.color === 'w' ? 2: 0)][moveToCell.file-1].piece = null;
            audio = new Audio('sounds/public_sound_standard_Capture.ogg');
        }
        if(!audio)
            audio = moveToCell.piece && pieceMoving.color != moveToCell.piece.color ? 
            new Audio('sounds/public_sound_standard_Capture.ogg'): new Audio('sounds/public_sound_standard_Move.ogg');
        if(moveToCell.piece && pieceMoving.color != moveToCell.piece.color)
            removePiece(moveToCell.piece);
        pieceMoving.piece.moveToReal(cells,{
            i: moveToCell.rank-1,
            j: moveToCell.file-1,
            special: pieceMoving.color === moveToCell.piece?.color ? 'castling': '',
        });
        

        turn = !turn;
        if(enPassantPawn && enPassantPawn !== pieceMoving)
            enPassantPawn.enPassant = false;
        if(isKingChecked(pieceMoving.color === 'w' ? 'b': 'w')){
            var checkedKing = pieceMoving.color === 'b' ? whiteKing: blackKing;
            cells[checkedKing.rank-1][checkedKing.file-1].checked = true;
            if(isCheckMate(checkedKing.color)) {
                audio = new Audio('sounds/public_sound_standard_Checkmate.ogg');
            }
        }
        audio.play();
        addClockMove(pieceMoving.color, moveValue, createFEN());
        cells = cells;
        // sendMoveToServer(clickedCell.rank,clickedCell.file,moveToCell.rank,moveToCell.file);
    }

    function getPieceCell(piece){
        return cells[piece.rank-1][piece.file-1];
    }

    function removePiece(piece) {
        if(piece.color === 'w')
            whitePieces = whitePieces.filter(p => p !== piece);
        else
            blackPieces = blackPieces.filter(p => p !== piece);
    }

//     //Is the color checked, for example if isCheckMate('w') === True ==> Black won
    function isCheckMate(color) {
        var piecesToCheck = color === 'w' ? whitePieces: blackPieces;
        for(let piece of piecesToCheck) {
            if(piece.getMoves(cells).filter(move => isMoveLegal(getPieceCell(piece),move)).length)
                return false;
        }
        console.log('stefan');
        return true;
    }

    function promotePiece(cell) {
        const promoteTo = '_qnrbbrnq'[cell.rank];
        const file = cell.file;
        let pieceAfterPromote = null;
        var promoteRank = pawnPromoting.color === 'w' ? 8: 1;
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
        getPieceCell(pawnPromoting).piece = null;
        removePiece(pawnPromoting);
        if(pawnPromoting.color === 'w')
            whitePieces.push(pieceAfterPromote);
        else
            blackPieces.push(pieceAfterPromote);
        pawnPromoting = null;
        var audio = null;
        if(cells[promoteRank-1][file-1].piece) {
            removePiece(cells[promoteRank-1][file-1].piece);
            audio = new Audio('sounds/public_sound_standard_Capture.ogg');
        }
        cells[promoteRank-1][file-1].piece = pieceAfterPromote;
        if(!audio)
            audio = new Audio('sounds/public_sound_standard_Move.ogg');
        audio.play();
        clearPromotingMoves();
        clearPossibleMoves();
        cells = cells;
        //TODO: maybe find better fix
        setTimeout(() => {
            clearPossibleMoves();
            cells = cells;
        }, 0);
    }

    function initBoardFromFEN(cells: Board,FENString){
        var segements = FENString.split(' ');
        var rank = 7;
        var file = 0;
        try {
            for(var i = 0 ; i < segements[0].length && segements[0][i] != ' ' ; i++){
                switch(segements[0][i]){
                    case 'P':
                        cells[rank][file].piece = new Pawn(PieceColor.White,rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'N':
                        cells[rank][file].piece = new Knight(PieceColor.White,rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'B':
                        cells[rank][file].piece = new Bishop(PieceColor.White,rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'R':
                        cells[rank][file].piece = new Rook(PieceColor.White,rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'Q':
                        cells[rank][file].piece = new Queen(PieceColor.White,rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'K':
                        cells[rank][file].piece = new King(PieceColor.White,rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        whiteKing = cells[rank][file].piece as King;
                        file++;
                        break;
                    case 'p':
                        cells[rank][file].piece = new Pawn(PieceColor.Black,rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'n':
                        cells[rank][file].piece = new Knight(PieceColor.Black,rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'b':
                        cells[rank][file].piece = new Bishop(PieceColor.Black,rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'r':
                        cells[rank][file].piece = new Rook(PieceColor.Black,rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'q':
                        cells[rank][file].piece = new Queen(PieceColor.Black,rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'k':
                        cells[rank][file].piece = new King(PieceColor.Black,rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        blackKing = cells[rank][file].piece as King;
                        file++;
                        break;
                    case '/':
                        file=0;
                        rank--;
                        break;
                    default:
                        if(!isNaN(parseInt(segements[0][i])))
                            file+=parseInt(segements[0][i]);
                }
            }
        }catch(err){
            console.log('FEN string bad');
        }
        //Handling  turn.
        // whiteTurn = segements[1] === 'w';
        //Handling what rooks can be castled
        // if(segements[2] !== '-'){
        //     if(segements[2].contains('K'))
        //         cells[0][7].piece.hasMoved = false;
        //     else
        //         cells[0][7].piece.hasMoved = true;
        //     if(segements[2].contains('Q'))
        //         cells[0][0].piece.hasMoved = false;
        //     else
        //         cells[0][0].piece.hasMoved = true;
        //     if(segements[2].contains('k'))
        //         cells[7][7].piece.hasMoved = false;
        //     else
        //         cells[7][7].piece.hasMoved = true;
        //     if(segements[2].contains('q'))
        //         cells[7][0].piece.hasMoved = false;
        //     else
        //         cells[7][0].piece.hasMoved = true;
        }
        //Handling what pawn can be En passant
        // if(segements[3] !== '-')
        //     enPassantPawn = cells[letterToNumber(segements[3][0])-1][segements[3][0]-1].piece.enPassant = true;
        //Handle Turns ...
    

    function cleanBoard(cells){
        whitePieces.length = 0;
        blackPieces.length = 0;
        for(var i = 0 ; i < 8 ; i++)
            for(var j = 0 ; j < 8 ; j++)
                cells[i][j].piece = null;
        blackKing = null;
        whiteKing = null;
    }

    export function rotateBoard(){
        boardSide = boardSide === 'w' ? 'b': 'w';
    }

    export function setColor(c){
        color = c;
    }

    export function movePieceByServer(res){
        movePieceTo(cells[res.originRank-1][res.originFile-1].piece,cells[res.destRank-1][res.destFile-1]);
    }

</script>


<div class='board' bind:this={board}>
    {#each [...cells].reverse() as row}
        {#each row as cell}
        <div class={`${cell.color}cell`} 
            class:whitecellclicked={cell.clicked && cell.color === 'white'}
            class:blackcellclicked={cell.clicked && cell.color === 'black'} on:click={() => {cell.promote ? promotePiece(cell): onCellClick(cell)}}>
            {#if cell.promote}
                <span class='promote-cell'></span>
                {#if cell.rank === 1 || cell.rank === 8}
                    <img class='piecesvg-promote' src='images/{cell.promote}_queen.svg' alt=''/>
                {:else if cell.rank === 2 || cell.rank === 7}
                    <img class='piecesvg-promote' src='images/{cell.promote}_knight.svg' alt=''/>
                {:else if cell.rank === 3 || cell.rank === 6}
                    <img class='piecesvg-promote' src='images/{cell.promote}_rook.svg' alt=''/>
                {:else if cell.rank === 4 || cell.rank === 5}
                    <img class='piecesvg-promote' src='images/{cell.promote}_bishop.svg' alt=''/>
                {/if}
            {:else if cell.piece}
                <img class='piecesvg' src='images/{cell.piece.color}_{getPieceType(cell.piece)}.svg' alt=''>
            {/if}
            {#if (cell.rank === 1 && boardSide === 'w') || (cell.rank === 8 && boardSide === 'b')}
                <span class='filenumber'>
                    {numberToLetter(cell.file)}        
                </span>
            {/if}
            {#if (cell.file === 8 && boardSide === 'w') || (cell.file === 1 && boardSide === 'b')}
                <span class='ranknumber'>
                    {cell.rank}
                </span>
            {/if}
            {#if cell.possibleMove}
                <span class={cell.piece ? 'piece-possible-move': 'move-location'}></span>
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
