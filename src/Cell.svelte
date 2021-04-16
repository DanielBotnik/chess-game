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

function numberToLetter(num){
    return String.fromCharCode(96 + num);
}
</script>

<style type="text/scss">

    $blackColor: #926B39;
    $whiteColor: #FDE9C1;

    .whitecell {
        background-color: $whiteColor;
        position: relative;
        
        div {
            color: $blackColor;
        }
    }
    .blackcell{
        background-color: $blackColor;
        position: relative;
        
        div {
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
</style>

<div id='cell' bind:this={cell} class={(rank + file) % 2 === 0 ? 'blackcell' : 'whitecell'}>
    {#if rank === 1}
        <div class='filenumber'>
            {numberToLetter(file)}        
        </div>
    {/if}

    {#if file === 8}
        <div class='ranknumber'>
            {rank}
        </div>
    {/if}

</div>