<script defer>

    import { onMount } from "svelte";
    import { Bishop } from "../pieces/bishop.js";
    import { Knight } from "../pieces/knight.js";
    import { Pawn } from '../pieces/pawn.js';
    import { Queen } from "../pieces/queen.js";
    import { Rook } from "../pieces/rook.js";
    import { King } from "../pieces/king.js";

    
    export var size;
    export var sendMoveToServer;

    let board = null;
    let boardSide = 'w';
    let color;
    let clickedCell = null;
    let pawnPromoting = null;
    let possibleMoveCells = [];
    let promotingCells = [];
    let blackPieces = [];
    let whitePieces = [];
    let blackKing = null;
    let whiteKing = null;
    let cells = [];
    let whiteTurn = true;
    let enPassantPawn = null;

    export var addClockMove;

    onMount(() => {
        board.style.width = `calc(${size}vmin + 2px)`;
        board.style.height = `calc(${size}vmin + 2px)`;
        Array.from({length: 8},(_) => {
            cells.push([]);
        });
        Array.from({length: 8},(_,i) => {
            Array.from({length: 8},(_,j) => {
                cells[7-i].push({
                    rank: i+1,
                    file: j+1,
                    color: (i+j) % 2 === 0 ? 'black' : 'white',
                    piece: null,
                    div: null,
                    clicked: false,
                    checked: false,
                    possibleMove: false,
                    promote: null,
                });
            });
        });
        cells.reverse();
        // This is the must stupidest line of code I've ever written
        cells=cells;
        initBoard(cells);
    });

    function numberToLetter(num){
        return String.fromCharCode(96 + num);
    }

    function letterToNumber(letter){
        return letter.charCodeAt(0) - 96;
    }

    function initBoard(cells){
        for(var i = 0 ; i < 8 ; i++) {
            cells[6][i].piece = new Pawn('b',7,i+1);
            blackPieces.push(cells[6][i].piece);
            cells[1][i].piece = new Pawn('w',2,i+1);
            whitePieces.push(cells[1][i].piece);
        }
        cells[0][0].piece = new Rook('w',1,1);
        cells[0][7].piece = new Rook('w',1,8);
        cells[0][1].piece = new Knight('w',1,2);
        cells[0][6].piece = new Knight('w',1,7);
        cells[0][2].piece = new Bishop('w',1,3);
        cells[0][5].piece = new Bishop('w',1,6);
        cells[0][3].piece = new Queen('w',1,4);
        cells[0][4].piece = new King('w',1,5);
        whiteKing = cells[0][4].piece;

        cells[7][0].piece = new Rook('b',8,1);
        cells[7][7].piece = new Rook('b',8,8);
        cells[7][1].piece = new Knight('b',8,2);
        cells[7][6].piece = new Knight('b',8,7);
        cells[7][2].piece = new Bishop('b',8,3);
        cells[7][5].piece = new Bishop('b',8,6);
        cells[7][3].piece = new Queen('b',8,4);
        cells[7][4].piece = new King('b',8,5);
        blackKing = cells[7][4].piece;

        for(var i = 0 ; i < 8 ; i++){
            blackPieces.push(cells[7][i].piece);
            whitePieces.push(cells[0][i].piece);
        }
    }

    function clearPossibleMoves() {
        for(var cell of possibleMoveCells) {
            cell.possibleMove = false;
        }
        for(var cell of promotingCells) {
            cell.promote = null;
        }
        possibleMoveCells.length = 0;
        if(clickedCell)
            clickedCell.clicked = false;
        if(pawnPromoting) {
            getPieceCell(pawnPromoting).piece = pawnPromoting;
            pawnPromoting = null;
        }
        promotingCells.length = 0;
    }

    function getPieceType(piece){
        return piece.constructor.name.toLowerCase();
    }

    function onCellClick(cell){
        if(cell.promote)
            return;
        if(cell.rank===1 && cell.file === 2)
            console.log(blackPieces);
        if(cell.possibleMove) {
            clearPossibleMoves();
            movePieceTo(clickedCell.piece,cell);
            //clearPossibleMoves();
        }
        else if(cell.piece === null || cell.clicked ) {
            clearPossibleMoves();
            cell.clicked = false;
            clickedCell = null;
        }
        else {
            // if(cell.piece.color !== color)
            //     return;
            // if(cell.piece.color === 'b' && whiteTurn)
            //     return;
            // if(cell.piece.color ==='w' && !whiteTurn)
            //     return;
            clearPossibleMoves();
            cell.clicked = true;
            clickedCell = cell;
            console.log(cell);
            showMoves(cell);
        }
        cells = cells;
    }

    function showMoves(cell){
        for(var move of getLegalMoves(cell)){
            cells[move.i][move.j].possibleMove = true;
            possibleMoveCells.push(cells[move.i][move.j]);
        }
        console.log('endShowMoves');
    }

    function getLegalMoves(cell){
        var legalMoves = [];
        try {
        for(var move of cell.piece.getMoves(cells)){
            if(isMoveLegal(cell,move))
                legalMoves.push(move);
        }
        }catch(err) {console.log(err);console.log(cell);}
        return legalMoves;
    }

    function isMoveLegal(cell,move){
        var pieceBefore = cells[move.i][move.j]?.piece;
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
        var kingToCheck = color === 'w' ? whiteKing : blackKing;
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
                    var piece = getPieceType(cells[i][j].piece).charAt(0);

                    fen += color === 'w' ? piece.toUpperCase() : piece.toLowerCase()
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
                       cells[i][j].piece = new Pawn('b',i+1,j+1);
                    break;
                    case 'P':
                       cells[i][j].piece = new Pawn('w',i+1,j+1);
                    break;
                    case 'r':
                       cells[i][j].piece = new Rook('b',i+1,j+1);
                    break;
                    case 'R':
                       cells[i][j].piece = new Rook('w',i+1,j+1);
                    break;
                    case 'n':
                       cells[i][j].piece = new Knight('b',i+1,j+1);
                    break;
                    case 'N':
                       cells[i][j].piece = new Knight('w',i+1,j+1);
                    break;
                    case 'b':
                       cells[i][j].piece = new Bishop('b',i+1,j+1);
                    break;
                    case 'B':
                       cells[i][j].piece = new Bishop('w',i+1,j+1);
                    break;
                    case 'q':
                       cells[i][j].piece = new Queen('b',i+1,j+1);
                    break;
                    case 'Q':
                       cells[i][j].piece = new Queen('w',i+1,j+1);
                    break;
                    case 'k':
                       cells[i][j].piece = new King('b',i+1,j+1);
                       blackKing = cells[i][j].piece;
                    break;
                    case 'K':
                       cells[i][j].piece = new King('w',i+1,j+1);
                       whiteKing = cells[i][j].piece;
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
                        whitePieces.push(cells[i][j].piece) :
                        blackPieces.push(cells[i][j].piece);
                }
                if (increase == 0)
                    fen = fen.substring(1);
            }
            fen = fen.substring(1);
        }
    }

    function movePieceTo(pieceCell,moveToCell){
        var moveValue = makeAMove(pieceCell,moveToCell)
        var color = pieceCell.piece.color
        var audio = moveToCell.piece ? 
        new Audio('sounds/public_sound_standard_Capture.ogg') : new Audio('sounds/public_sound_standard_Move.ogg');
        if(moveToCell.piece) {
            if(moveToCell.piece.color === 'w')
                whitePieces = whitePieces.filter((piece) => {return moveToCell.piece !== piece});
            else 
                blackPieces = blackPieces.filter((piece) => {return moveToCell.piece !== piece});
//     function movePieceTo(pieceMoving,moveToCell){
//         var audio = null;
//         //Removing check class from checked king ,if king moved he cannot be in check ;-)
//         if(pieceMoving.color === 'w')
//             getPieceCell(whiteKing).checked = false;
//         else
//             getPieceCell(blackKing).checked = false;
//         //Handle Promotion
//         if(getPieceType(pieceMoving) === 'pawn' && 
//         ((pieceMoving.color === 'b' && moveToCell.rank === 1) || (pieceMoving.color === 'w' && moveToCell.rank === 8))) {
//             var movingDirection = pieceMoving.color === 'w' ? -1 : 1;
//             pawnPromoting = pieceMoving;
//             getPieceCell(pieceMoving).piece = null;
//             for(var i = 0; i < 4 ; i++) {
//                 promotingCells.push(cells[moveToCell.rank-1+movingDirection * i][moveToCell.file - 1]);
//                 cells[moveToCell.rank-1+movingDirection * i][moveToCell.file-1].promote = pieceMoving.color;
//             }
//             return;
        }
        //Handling En Passant
        if(getPieceType(pieceMoving) === 'pawn' && Math.abs(moveToCell.rank-pieceMoving.rank) === 2) {
            if(enPassantPawn)
                enPassantPawn.enPassant = false;
            enPassantPawn = pieceMoving;
        }
        if(getPieceType(pieceMoving) === 'pawn' && moveToCell.file != pieceMoving.file && !moveToCell.piece){
            removePiece(moveToCell.piece);
            cells[moveToCell.rank-(pieceMoving.color === 'w' ? 2 : 0)][moveToCell.file-1].piece = null;
            audio = new Audio('sounds/public_sound_standard_Capture.ogg');
        }
        //End of handling En Passant
        if(!audio)
            audio = moveToCell.piece && pieceMoving.color != moveToCell.piece.color? 
            new Audio('sounds/public_sound_standard_Capture.ogg') : new Audio('sounds/public_sound_standard_Move.ogg');
        if(moveToCell.piece && pieceMoving.color != moveToCell.piece.color)
            removePiece(moveToCell.piece);
        pieceMoving.moveToReal(cells,{
            i: moveToCell.rank-1,
            j: moveToCell.file-1,
            special: pieceMoving.color === moveToCell.piece?.color ? 'castling' : '',
        });
        var fen = createFEN();
        addClockMove(color, moveValue, fen)

//         whiteTurn = !whiteTurn;
//         if(enPassantPawn && enPassantPawn !== pieceMoving)
//             enPassantPawn.enPassant = false;
//         if(isKingChecked(pieceMoving.color === 'w' ? 'b' : 'w')){
//             var checkedKing = pieceMoving.color === 'b' ? whiteKing : blackKing;
//             cells[checkedKing.rank-1][checkedKing.file-1].checked = true;
//             if(isCheckMate(checkedKing.color)) {
//                 audio = new Audio('sounds/public_sound_standard_Checkmate.ogg');
//             }
//         }
//         audio.play();
//         cells = cells;
//         sendMoveToServer(clickedCell.rank,clickedCell.file,moveToCell.rank,moveToCell.file);
//     }

//     function getPieceCell(piece) {
//         return cells[piece.rank-1][piece.file-1];
//     }

//     function removePiece(piece) {
//         if(piece.color === 'w')
//             whitePieces = whitePieces.filter(p => p != piece);
//         else
//             blackPieces = blackPieces.filter(p => p != piece);
//     }
//     //Is the color checked, for example if isCheckMate('w') === True ==> Black won
//     function isCheckMate(color) {
//         var piecesToCheck = color === 'w' ? whitePieces : blackPieces;
//         for(var piece of piecesToCheck) {
//             if(getLegalMoves(getPieceCell(piece)).length)
//                 return false;
//         }
//         return true;
//     }

//     function promotePiece(promoteTo,promoteFile) {
//         var pieceAfterPromote = null;
//         var promoteRank = pawnPromoting.color === 'w' ? 8 : 1;
//         switch(promoteTo) {
//             case 'q':
//                 pieceAfterPromote = new Queen(pawnPromoting.color,promoteRank,promoteFile);
//                 break;
//             case 'n':
//                 pieceAfterPromote = new Knight(pawnPromoting.color,promoteRank,promoteFile);
//                 break;
//             case 'r':
//                 pieceAfterPromote = new Rook(pawnPromoting.color,promoteRank,promoteFile);
//                 break;
//             case 'b':
//                 pieceAfterPromote = new Bishop(pawnPromoting.color,promoteRank,promoteFile);
//                 break;
//         }
//         cells[pawnPromoting.rank-1][pawnPromoting.file-1].piece = null;
//         removePiece(pawnPromoting);
//         if(pawnPromoting.color === 'w')
//             whitePieces.push(pieceAfterPromote);
//         else
//             blackPieces.push(pieceAfterPromote);
//         pawnPromoting = null;
//         var audio = null;
//         if(cells[promoteRank-1][promoteFile-1].piece) {
//             removePiece(cells[promoteRank-1][promoteFile-1].piece);
//             audio = new Audio('sounds/public_sound_standard_Capture.ogg');
//         }
//         cells[promoteRank-1][promoteFile-1].piece = pieceAfterPromote;
//         if(!audio)
//             audio = new Audio('sounds/public_sound_standard_Move.ogg');
//         audio.play();
//         clearPossibleMoves();
    }

    function playMovePGN(move){
        var pieces = whiteTurn ? whitePieces : blackPieces;
        var king = whiteTurn ? whiteKing : blackKing;
        if(move.includes('.'))
            move = move.split('.')[1].trim();
        if(move[0] === 'O'){
            if(move === 'O-O-O'){
                movePieceTo(king,cells[7-(whiteTurn)*7][0])
            }
            else if(move === 'O-O'){
                movePieceTo(king,cells[7-(whiteTurn)*7][7]);
            }
            else {
                // Error
            }
            return;
        }
    }


    function initBoardFromFEN(cells,FENString){
        var segements = FENString.split(' ');
        var rank = 7;
        var file = 0;
        try {
            for(var i = 0 ; i < segements[0].length && segements[0][i] != ' ' ; i++){
                switch(segements[0][i]){
                    case 'P':
                        cells[rank][file].piece = new Pawn('w',rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'N':
                        cells[rank][file].piece = new Knight('w',rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'B':
                        cells[rank][file].piece = new Bishop('w',rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'R':
                        cells[rank][file].piece = new Rook('w',rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'Q':
                        cells[rank][file].piece = new Queen('w',rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'K':
                        cells[rank][file].piece = new King('w',rank+1,file+1);
                        whitePieces.push(cells[rank][file].piece);
                        whiteKing = cells[rank][file].piece;
                        file++;
                        break;
                    case 'p':
                        cells[rank][file].piece = new Pawn('b',rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'n':
                        cells[rank][file].piece = new Knight('b',rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'b':
                        cells[rank][file].piece = new Bishop('b',rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'r':
                        cells[rank][file].piece = new Rook('b',rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'q':
                        cells[rank][file].piece = new Queen('b',rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        file++;
                        break;
                    case 'k':
                        cells[rank][file].piece = new King('b',rank+1,file+1);
                        blackPieces.push(cells[rank][file].piece);
                        blackKing = cells[rank][file].piece;
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
        whiteTurn = segements[1] === 'w';
        //Handling what rooks can be castled
        if(segements[2] !== '-'){
            if(segements[2].contains('K'))
                cells[0][7].piece.hasMoved = false;
            else
                cells[0][7].piece.hasMoved = true;
            if(segements[2].contains('Q'))
                cells[0][0].piece.hasMoved = false;
            else
                cells[0][0].piece.hasMoved = true;
            if(segements[2].contains('k'))
                cells[7][7].piece.hasMoved = false;
            else
                cells[7][7].piece.hasMoved = true;
            if(segements[2].contains('q'))
                cells[7][0].piece.hasMoved = false;
            else
                cells[7][0].piece.hasMoved = true;
        }
        //Handling what pawn can be En passant
        if(segements[3] !== '-')
            enPassantPawn = cells[letterToNumber(segements[3][0])-1][segements[3][0]-1].piece.enPassant = true;
        //Handle Turns ...
    }

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
        boardSide = boardSide === 'w' ? 'b' : 'w';
    }

    export function setColor(c){
        color = c;
    }

    export function movePieceByServer(res){
        movePieceTo(cells[res.originRank-1][res.originFile-1].piece,cells[res.destRank-1][res.destFile-1]);
    }

</script>


<div class='board' bind:this={board}>
    {#each boardSide === 'w' ? [...cells].reverse() : cells as row}
        {#each boardSide === 'w' ? row : [...row].reverse() as cell}
        <div
            class={`${cell.color}cell`} on:click={() => {onCellClick(cell)}}
            class:clicked='{cell.clicked}'>
            {#if cell.promote}
                <span class='promote-cell'>
                </span>
                {#if cell.rank === 1 || cell.rank === 8}
                    <img class='piecesvg-promote' src='images/{cell.promote}_queen.svg' alt='' on:click={promotePiece('q',cell.file)}/>
                {:else if cell.rank === 2 || cell.rank === 7}
                    <img class='piecesvg-promote' src='images/{cell.promote}_knight.svg' alt='' on:click={promotePiece('n',cell.file)}/>
                {:else if cell.rank === 3 || cell.rank === 6}
                    <img class='piecesvg-promote' src='images/{cell.promote}_rook.svg' alt='' on:click={promotePiece('r',cell.file)}/>
                {:else if cell.rank === 4 || cell.rank === 5}
                    <img class='piecesvg-promote' src='images/{cell.promote}_bishop.svg' alt='' on:click={promotePiece('b',cell.file)}/>
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
                <span class={cell.piece ? 'piece-possible-move' : 'move-location'}></span>
            {:else if cell.checked}
                <span class={'location-check'}></span>
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

    .piecesvg-promote {
        min-height: 100%;
        min-width: 100%;
        transform: scale(0.75);
    }

    :global(.promotion-cell) {
        background-color: black;
    }

</style>
