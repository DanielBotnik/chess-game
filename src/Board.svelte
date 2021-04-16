<script defer>
    import Cell from './Cell.svelte'
    import { onMount } from "svelte";

    export let size;
    let board = null;
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
                piece: null,
            };
            return cell;
        });
        init_board(cells);
    });

    function init_board(cells){
        for(var i = 8 ; i < 16 ; i++)
            cells[i].piece = {color:'w',type:'pawn'};
    }

    
</script>


<div class='board' bind:this={board}>
    {#each cells as cell}
        <Cell rank={cell.rank} file={cell.file} piece={cell.piece} size={board.style.width.split('vmin')[0]}/>
    {/each}
</div>


<style>
    .board {
        border: 2px solid #926B39;
        display:grid;
        grid-template-columns: repeat(8,1fr);
        grid-template-rows: repeat(8,1fr);
    }
</style>