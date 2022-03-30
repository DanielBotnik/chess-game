<script lang="ts">
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	import Chat from './Chat.svelte';
	import Start from './Start.svelte';

	import { BoardType, Color } from '../types';
	
	// const socket = io('http://localhost:4919');
	let board: Board;
	let clock: Clock;
	setTimeout(() => {
		board.setClock(clock);
		clock.setBoard(board);
	},0);

</script>
<div>
	<Clock bind:this={clock}/>
	<Board bind:this={board} size={70} boardType={BoardType.AGINST_PLAYER}/>
	<Chat/>
</div>
