<script>
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	import Chat from './Chat.svelte';
	import Start from './Start.svelte';


	
	let clock;
	// const socket = io('ws://localhost:8080');

	// socket.on('message', text => {
	// 	const el = document.createElement('li');
	// 	el.innerHTML = text;
	// 	document.querySelector('ul').appendChild(el)
	// });

	// document.querySelector('button').onclick = () => {
	// 	const text = document.querySelector('input').value;
	// 	socket.emit('message', text)
	// }


	function callClock(color, value, fen) {
		clock.addMove(color, value, fen)
		//clock.markThePointer() - if you play these function, the game stop work in second turn
        //clock.unmarkThePointer()
	}

</script>
<div>
	<!-- <Clock bind:this={clock}/>
	<Board size={70} addClockMove={callClock}/>
	<Chat/> -->
	<Start/>
</div>
