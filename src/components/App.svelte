<script>
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	
	let clock;
	let board;

	function callClock(color, value, fen) {
		clock.addMove(color, value, fen)
	}

	function changeBoardFromClock(fen) {
		return board.changeBoard(fen);
	}

</script>
<div>
	<Clock bind:this={clock} changeBoard={changeBoardFromClock} />
	<Board bind:this={board} size={70} addClockMove={callClock} changeBoard={changeBoardFromClock}/>
	<!-- <Board size={70}/> -->

</div>
