<script>
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	
	let clock;

	function callClock(color, value, fen) {
		clock.addMove(color, value, fen)
		//clock.markThePointer() - if you play these function, the game stop work in second turn
        //clock.unmarkThePointer()
	}

</script>
<div>
	<Clock bind:this={clock}/>
	<Board size={70} addClockMove={callClock}/>
	<!-- <Board size={70}/> -->

</div>
