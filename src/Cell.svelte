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

<style>
    .whitecell {
        background-color: white;
    }
    .blackcell{
        background-color:  black;
    }
</style>

<div id='cell' bind:this={cell} class={(rank + file) % 2 === 0 ? 'blackcell' : 'whitecell'}>
</div>