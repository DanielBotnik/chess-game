<script defer>

    import { onMount } from "svelte";
    import { Bishop } from "../pieces/bishop.js";
    import { Knight } from "../pieces/knight.js";
    import { Pawn } from '../pieces/pawn.js';
    import { Queen } from "../pieces/queen.js";
    import { Rook } from "../pieces/rook.js";
    import { King } from '../pieces/king.js'

    export let size;
    let board = null;
    let clickedCell = null;
    let possibleMoveCells = [];
    let blackPieces = [];
    let whitePieces = [];
    let blackKing = null;
    let whiteKing = null;
    var cells = [];

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

    function init_board(cells){
        for(var i = 0 ; i < 8 ; i++) {
            cells[6][i].piece = new Pawn('b',7,i+1);
            blackPieces.push(cells[6][i].piece);
            cells[1][i].piece = new Pawn('w',2,i+1);
            whitePieces.push(cells[1][i].piece);
        }
        cells[0][0].piece = new Rook('w',1,1);
        cells[0][7].piece = new Rook('w',1,8);
        cells[0][1].piece = new Bishop('w',1,2);
        cells[0][6].piece = new Bishop('w',1,7);
        cells[0][2].piece = new Knight('w',1,3);
        cells[0][5].piece = new Knight('w',1,6);
        cells[0][3].piece = new Queen('w',1,4);
        cells[0][4].piece = new King('w',1,5);
        whiteKing = cells[0][4].piece;

        cells[7][0].piece = new Rook('b',8,1);
        cells[7][7].piece = new Rook('b',8,8);
        cells[7][1].piece = new Bishop('b',8,2);
        cells[7][6].piece = new Bishop('b',8,7);
        cells[7][2].piece = new Knight('b',8,3);
        cells[7][5].piece = new Knight('b',8,6);
        cells[7][3].piece = new Queen('b',8,4);
        cells[7][4].piece = new King('b',8,5);
        blackKing = cells[7][4].piece;

        for(var i = 0 ; i < 8 ; i++){
            blackPieces.push(cells[7][i].piece);
            whitePieces.push(cells[0][i].piece);
        }
    }

    function clearPossibleMoves(){
        for(var cell of possibleMoveCells)
            cell.div.querySelector('.move-location')?.remove();
        possibleMoveCells.length = 0;
    }

    function getPieceType(piece){
        return piece.constructor.name.toLowerCase();
    }

    function onCellClick(cell){
        if([...cell.div.childNodes].map(node => node.className).includes('move-location')){
            clearPossibleMoves();
            movePieceTo(clickedCell,cell);
            clearPossibleMoves();
            clickedCell?.div.classList.remove('whitecellclicked','blackcellclicked');
        }
        else if(cell.piece === null || cell.div.classList.contains(`${cell.color}cellclicked`))
        {
            clearPossibleMoves();
            cell.div.classList.remove(`${cell.color}cellclicked`);
            clickedCell?.div.classList.remove('whitecellclicked','blackcellclicked');
            clickedCell = null;
        }
        else {
            clearPossibleMoves();
            clickedCell?.div.classList.remove('whitecellclicked','blackcellclicked');
            cell.div.classList.add(`${cell.color}cellclicked`);
            clickedCell = cell;
            showMoves(cell);
        }
        cells = cells;
    }

    function showMoves(cell){
        var legalMoves = [];
        for(var move of cell.piece.getMoves(cells)) {
            if(isMoveLegal(cell,move))
                legalMoves.push(move);
        }
        for(var move of legalMoves){
            var moveSpan = document.createElement('span');
            moveSpan.classList.add('move-location');
            cells[move.i][move.j].div.appendChild(moveSpan);
            possibleMoveCells.push(cells[move.i][move.j]);
        }
    }

    function isMoveLegal(cell,move){
        var pieceBefore = cells[move.i][move.j]?.piece;
        if(pieceBefore) {
            if(pieceBefore.color === 'w')
                whitePieces = whitePieces.filter((piece) => {return pieceBefore !== piece});
            else
                blackPieces = blackPieces.filter((piece) => {return pieceBefore !== piece});
        }
        cell.piece.moveToCheck(cells,move);
        var res = !isKingChecked(cells[move.i][move.j].piece.color);
        cells[move.i][move.j].piece.moveToCheck(cells,{
            i: cell.rank-1,
            j: cell.file-1
        });
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
        var enemiesToCheck = color === 'w' ? blackPieces : whitePieces;
        for(var enemy of enemiesToCheck)
            for(var move of enemy.getMoves(cells))
                if(move.i === kingToCheck.rank-1 && move.j === kingToCheck.file-1) {
                    return true;
                }
        return false;
    }

    function movePieceTo(pieceCell,moveToCell){
        var audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        pieceCell.piece.moveToReal(cells,{
            i: moveToCell.rank-1,
            j: moveToCell.file-1,
        });
        audio.play();
    }

</script>


<div class='board' bind:this={board}>
    {#each [...cells].reverse() as row}
        {#each row as cell}
        <div bind:this={cell.div} class={`${cell.color}cell`} on:click={() => {onCellClick(cell)}}>
            {#if cell.piece !== null}
                <img class='piecesvg' src='images/{cell.piece.color}_{getPieceType(cell.piece)}.svg' alt=''> 
            {/if}
            {#if cell.rank === 1}
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
    
    $blackColor: #926B38;
    $whiteColor: #FDE9C1;
    $whiteColorClicked: #B5FD90;
    $blackColorClicked: #D3AAEF; 
    
    .board {
        border: 2px solid #926B39;
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
        min-height: 20px;
        min-width: 20px;
    }

    .whitecellclicked {
        background-color: $whiteColorClicked;
    }

    .blackcellclicked {
        background-color: $blackColorClicked;
    }

    :global(.move-location) {
        height: 35%;
        width: 35%;
        border-radius: 50%;
        background:black;
    }

</style>