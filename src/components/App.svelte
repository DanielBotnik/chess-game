<script>
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	
	let clock;

	function callClock(color, value) {
		clock.addMove(color, value)
		clock.markThePointer()
        clock.unmarkThePointer()
	}

</script>
<div>
	<Clock bind:this={clock}/>
	<Board size={70} addClockMove={callClock}/>
	<!-- <Board size={70}/> -->

</div>
