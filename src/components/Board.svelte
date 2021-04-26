<script defer>

    import { onMount } from "svelte";
    import { Bishop } from "../pieces/bishop.js";
    import { Knight } from "../pieces/knight.js";
    import { Pawn } from '../pieces/pawn.js';
    import { Queen } from "../pieces/queen.js";
    import { Rook } from "../pieces/rook.js";
    import { King } from "../pieces/king.js";
    
    export var size;
    export var color;

    let board = null;
    let boardSide;
    let clickedCell = null;
    let possibleMoveCells = [];
    let blackPieces = [];
    let whitePieces = [];
    let blackKing = null;
    let whiteKing = null;
    let cells = [];
    let whiteTurn = true;

    onMount(() => {
        boardSide = color;
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
                });
            });
        });
        cells.reverse();
        // This is the must stupidest line of code I've ever written
        cells=cells;
        init_board(cells);
    });

    function numberToLetter(num){
        return String.fromCharCode(96 + num);
    }

    function letterToNumber(letter){
        return letter.charCodeAt(0) - 96;
    }

    function init_board(cells){
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

    function clearPossibleMoves(){
        console.log(whitePieces);
        for(var cell of possibleMoveCells) {
            cell.div.querySelector(`.move-location-${cell.piece ? 'piece-' : ''}${cell.color}`)?.remove();
        }
        possibleMoveCells.length = 0;
        clickedCell?.div.classList.remove('whitecell-clicked','blackcell-clicked');
    }

    function getPieceType(piece){
        return piece.constructor.name.toLowerCase();
    }

    function onCellClick(cell){
        if([...cell.div.childNodes].map(node => node.className)
        .includes(`move-location-${cell.piece ? 'piece-' : ''}${cell.color}`)) {
            clearPossibleMoves();
            movePieceTo(clickedCell,cell);
            clearPossibleMoves();
        }
        else if(cell.piece === null || cell.div.classList.contains(`${cell.color}cell-clicked`)) {
            clearPossibleMoves();
            cell.div.classList.remove(`${cell.color}cell-clicked`);
            clickedCell?.div.classList.remove('whitecell-clicked','blackcell-clicked');
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
            clickedCell?.div.classList.remove('whitecell-clicked','blackcell-clicked');
            cell.div.classList.add(`${cell.color}cell-clicked`);
            clickedCell = cell;
            showMoves(cell);
        }
        cells = cells;
    }

    function showMoves(cell){
        for(var move of getLegalMoves(cell)){
            var moveSpan = document.createElement('span');
            moveSpan.classList.add(`move-location-${cells[move.i][move.j].piece ? 'piece-' : ''}${cells[move.i][move.j].color}`);
            cells[move.i][move.j].div.appendChild(moveSpan);
            possibleMoveCells.push(cells[move.i][move.j]);
        }
    }

    function getLegalMoves(cell){
        var legalMoves = [];
        for(var move of cell.piece.getMoves(cells)){
            if(isMoveLegal(cell,move))
                legalMoves.push(move);
        }
        return legalMoves;
    }

    function isMoveLegal(cell,move){
        var pieceBefore = cells[move.i][move.j]?.piece;
        if(pieceBefore) {
            if(pieceBefore.color === 'w')
                whitePieces = whitePieces.filter((piece) => {return pieceBefore !== piece});
            else
                blackPieces = blackPieces.filter((piece) => {return pieceBefore !== piece});
        }
        var pieceMoved = cell.piece;
        cell.piece.moveToCheck(cells,move);
        var res = !isKingChecked(pieceMoved.color);
        if(!cells[move.i][move.j].piece) {
            if(move.j === 7){
                pieceMoved.moveToCheck(cells,{
                    i: pieceMoved.rank-1,
                    j: 4,
                });
                cells[pieceMoved.rank-1][6].piece = null;
                cells[pieceMoved.rank-1][5].piece = null;
            }
            else {
                pieceMoved.moveToCheck(cells,{
                    i:pieceMoved.rank-1,
                    j:4
                })
                cells[pieceMoved.rank-1][3].piece = null;
                cells[pieceMoved.rank-1][2].piece = null;
            }
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

    function movePieceTo(pieceCell,moveToCell){
        var pieceMoving = pieceCell.piece;
        if(pieceCell.piece.color === 'w')
            cells[whiteKing.rank-1][whiteKing.file-1].div.querySelector('.location-check')?.remove();
        else
            cells[blackKing.rank-1][blackKing.file-1].div.querySelector('.location-check')?.remove();
        var audio = moveToCell.piece && pieceMoving.color != moveToCell.piece.color ? 
        new Audio('sounds/public_sound_standard_Capture.ogg') : new Audio('sounds/public_sound_standard_Move.ogg');
        if(moveToCell.piece && pieceMoving.color != moveToCell.piece.color) {
            if(moveToCell.piece.color === 'w')
                whitePieces = whitePieces.filter((piece) => {return moveToCell.piece !== piece});
            else
                blackPieces = blackPieces.filter((piece) => {return moveToCell.piece !== piece});
        }
        pieceMoving.moveToReal(cells,{
            i: moveToCell.rank-1,
            j: moveToCell.file-1,
        });
        whiteTurn = !whiteTurn;
        if(pieceMoving.color === 'w' && isKingChecked('b')) {
            var checkSpan = document.createElement('span');
            checkSpan.classList.add('location-check');
            cells[blackKing.rank-1][blackKing.file-1].div.appendChild(checkSpan);
            if(isCheckMate('b')){
                audio = new Audio('sounds/public_sound_standard_Checkmate.ogg');
                audio.play();
                return;
            }
        }
        else if(pieceMoving.color === 'b' && isKingChecked('w')) {
            var checkSpan = document.createElement('span');
            checkSpan.classList.add('location-check');
            cells[whiteKing.rank-1][whiteKing.file-1].div.appendChild(checkSpan);
            if(isCheckMate('w')){
                audio = new Audio('sounds/public_sound_standard_Checkmate.ogg');
                audio.play();
                return;
            }
        }
        audio.play();
    }

    //Is the color checked, for example if isCheckMate('w') === True ==> Black won
    function isCheckMate(color) {
        var piecesToCheck = color === 'w' ? whitePieces : blackPieces;
        for(var piece of piecesToCheck) {
            if(getLegalMoves(cells[piece.rank-1][piece.file-1]).length)
                return false;
        }
        return true;
    }

    function playMovePGN(move){
        var pieces = whiteTurn ? whitePieces : blackPieces;
        var king = whiteTurn ? whiteKing : blackKing;
        if(move.contains('.'))
            move = move.split('.')[1].trim();
        if(move[0] === 'O'){
            if(move === 'O-O-O'){

            }
            else {

            }
            return;
        }
        

    }
</script>


<div class='board' bind:this={board}>
    {#each boardSide === 'w' ? [...cells].reverse() : [...cells] as row}
        {#each row as cell}
        <div bind:this={cell.div} class={`${cell.color}cell`} on:click={() => {onCellClick(cell)}}>
            {#if cell.piece !== null}
                <img class='piecesvg' src='images/{cell.piece.color}_{getPieceType(cell.piece)}.svg' alt=''>
            {/if}
            {#if (cell.rank === 1 && boardSide === 'w') || (cell.rank === 8 && boardSide === 'b')}
                <span class='filenumber'>
                    {numberToLetter(cell.file)}        
                </span>
            {/if}
            {#if cell.file === 8}
                <span class='ranknumber'>
                    {cell.rank}
                </span>
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
    
    .board {
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
    }
    .blackcell{
        display:flex;
        justify-content: center;
        align-items: center;
        background-color: $blackColor;
        position: relative;
        
        span {
            color: $whiteColor;
        }
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

    .whitecell-clicked {
        background-color: $whiteColorClicked;
    }

    .blackcell-clicked {
        background-color: $blackColorClicked;
    }

    :global(.move-location-white) {
        height: 35%;
        width: 35%;
        border-radius: 50%;
        background: $whiteColorClicked;
    }

    :global(.move-location-black){
        height: 35%;
        width: 35%;
        border-radius: 50%;
        background: $blackColorClicked;
    }

    :global(.move-location-piece-black){
        height:100%;
        width:100%;
        position:absolute;
        background: radial-gradient(transparent 0%, transparent 79%, $blackColorClicked);
    }

    :global(.move-location-piece-white){
        height:100%;
        width:100%;
        position:absolute;
        background: radial-gradient(transparent 0%, transparent 79%, $whiteColorClicked);
    }

    :global(.location-check){
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 0;
        background: radial-gradient(ellipse at center, rgb(250, 75, 75) 0%, #e70000 25%, rgba(169,0,0,0) 89%, rgba(158,0,0,0) 100%);
    }

</style>
