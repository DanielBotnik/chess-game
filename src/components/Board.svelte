<script defer>
    import { onMount } from "svelte";
import { clear_loops } from "svelte/internal";
    import { Knight } from "../pieces/knight.js";
    import { Pawn } from '../pieces/pawn.js';
    import { Rook } from "../pieces/rook.js";
    export let size;
    let board = null;
    let clickedDiv = null;
    let possibleMoveCells = [];
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
            cells[1][i].piece = new Pawn('w',2,i+1);
        }

        cells[0][0].piece = new Rook('w',1,1);
        cells[0][7].piece = new Rook('w',1,8);
        cells[0][1].piece = {color:'w',type:'bishop'};
        cells[0][6].piece = {color:'w',type:'bishop'};
        cells[0][2].piece = new Knight('w',1,3);
        cells[0][5].piece = new Knight('w',1,6);
        cells[0][3].piece = {color:'W',type:'queen'};
        cells[0][4].piece = {color:'w',type:'king'};

        cells[7][0].piece = new Rook('b',8,1);
        cells[7][7].piece = new Rook('b',8,8);
        cells[7][1].piece = {color:'b',type:'bishop'};
        cells[7][6].piece = {color:'b',type:'bishop'};
        cells[7][2].piece = new Knight('w',8,3);
        cells[7][5].piece = new Knight('w',8,6);
        cells[7][3].piece = {color:'b',type:'queen'};
        cells[7][4].piece = {color:'b',type:'king'};
    }

    function clearPossibleMoves(){
        possibleMoveCells.forEach((cell) => {
            cell.div.querySelector('.move-location')?.remove();
        })
    }

    function onCellClick(cell){
        if(cell.piece === null || cell.div.classList.contains(`${cell.color}cellclicked`))
        {
            clearPossibleMoves();
            cell.div.classList.remove(`${cell.color}cellclicked`);
            clickedDiv?.classList.remove('whitecellclicked','blackcellclicked');
            clickedDiv = null;
        }
        else {
            clearPossibleMoves();
            possibleMoveCells.length = [];
            clickedDiv?.classList.remove('whitecellclicked','blackcellclicked');
            cell.div.classList.add(`${cell.color}cellclicked`);
            clickedDiv = cell.div;
            showMoves(cell);
        }
    }

    function showMoves(cell){
        if(cell.piece !== null){
            cell.piece.getMoves(cells)
            cell.piece.getMoves(cells).forEach((move) => {
               var moveSpan = document.createElement('span');
               moveSpan.classList.add('move-location');
               cells[move.i][move.j].div.appendChild(moveSpan);
               possibleMoveCells.push(cells[move.i][move.j]);
            });
        }
    }

</script>


<div class='board' bind:this={board}>
    {#each [...cells].reverse() as row}
        {#each row as cell}
        <div bind:this={cell.div} class={`${cell.color}cell`} on:click={() => {onCellClick(cell)}}>
            {#if cell.piece !== null}
                <img class='piecesvg' src='images/{cell.piece.color}_{cell.piece.type}.svg' alt=''> 
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