<script defer>
    import { onMount } from "svelte";
    import {Pawn} from '../pieces/pawn.js';
    export let size;
    let board = null;
    let clickedDiv = null;
    let possibleMoveCells = [];
    var cells = [];

    onMount(() => {
        board.style.width = `calc(${size}vmin + 2px)`;
        board.style.height = `calc(${size}vmin + 2px)`;

        cells = Array.from({length: 64},(_,index) => {
            const rank = 7 - Math.floor(index / 8) + 1;
            const file = 1 + (index % 8);
            const cell = {
                rank: rank,
                file: file,
                color: (rank+file) % 2 === 0 ? 'black' : 'white',
                piece: null,
                div: null,
            };
            return cell;
        });
        init_board(cells);
    });

    function numberToLetter(num){
        return String.fromCharCode(96 + num);
    }

    function init_board(cells){
        for(var i = 8 ; i < 16 ; i++) {
            cells[63-i].piece = new Pawn('w',Math.floor((63-i) / 8) + 1,((63-i) % 8) + 1);
            cells[i].piece = new Pawn('b',Math.floor(i / 8) + 1,(i % 8) + 1);
        }

        cells[0].piece = {color:'b',type:'rook'};
        cells[7].piece = {color:'b',type:'rook'};
        cells[1].piece = {color:'b',type:'bishop'};
        cells[6].piece = {color:'b',type:'bishop'};
        cells[2].piece = {color:'b',type:'knight'};
        cells[5].piece = {color:'b',type:'knight'};
        cells[3].piece = {color:'b',type:'queen'};
        cells[4].piece = {color:'b',type:'king'};

        cells[63].piece = {color:'w',type:'rook'};
        cells[56].piece = {color:'w',type:'rook'};
        cells[62].piece = {color:'w',type:'bishop'};
        cells[57].piece = {color:'w',type:'bishop'};
        cells[61].piece = {color:'w',type:'knight'};
        cells[58].piece = {color:'w',type:'knight'};
        cells[59].piece = {color:'w',type:'queen'};
        cells[60].piece = {color:'w',type:'king'};
    }

    function onPieceClick(cell){
        if(cell.piece === null)
            return;
        if(cell.div.classList.contains(`${cell.color}cellclicked`)) {
            cell.div.classList.remove(`${cell.color}cellclicked`);
            clickedDiv = null;
        }
        else {
            clickedDiv?.classList.remove('whitecellclicked','blackcellclicked');
            cell.div.classList.add(`${cell.color}cellclicked`);
            clickedDiv = cell.div;
        }
        showMoves(cell);
    }

    function showMoves(cell){
        var row = 8 - cell.rank;
        var col = cell.file - 1;
        if(cell.piece.type === 'pawn'){
            cell.piece.getMoves().forEach((move) => {
                possibleMoveCells.push(cells[move]);
            });
        }
    }

</script>


<div class='board' bind:this={board}>
    {#each cells as cell}
        <div bind:this={cell.div} class={`${cell.color}cell`} on:click={() => {onPieceClick(cell)}}>
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
            {#if cell.rank === 4 && cell.file === 4}
                <span class='move-location'></span>
            {/if}
        </div>
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
        min-height: 100%;
        min-width: 100%;
    }

    .whitecellclicked {
        background-color: $whiteColorClicked;
    }

    .blackcellclicked {
        background-color: $blackColorClicked;
    }

    .move-location {
        height: 35%;
        width: 35%;
        border-radius: 50%;
        background:black;
    }

</style>