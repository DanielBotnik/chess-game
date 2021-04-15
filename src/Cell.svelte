<script>

import { onMount } from "svelte";

export let rank;
export let file;
export let size;

let cell = null;

onMount(() => {
    cell.style.height = `${size/8}vmin`;
    cell.style.width = `${size/8}vmin`;
});
</script>

<style lang="scss">
    .whitecell {
        background-color: white;
        > div {
            color:black;
        }
    }
    .blackcell{
        background-color: black;
        > div {
            color:white;
        }
    }
</style>

<div id='cell' bind:this={cell} class={(rank + file) % 2 === 0 ? 'blackcell' : 'whitecell'}>
    {#if rank === 8}
        <div>
            {file}        
        </div>
    {/if}

    {#if file === 1}
        <div>
            {rank}
        </div>
    {/if}

</div>