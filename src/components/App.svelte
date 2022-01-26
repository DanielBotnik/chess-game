<script>
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	import Chat from './Chat.svelte';
	import Start from './Start.svelte';

	import io from 'socket.io-client';
	
	// const socket = io('http://localhost:4919');
	let board = null;

	// socket.on('set-color-start',res => {
	// 	console.log(res);
	// 	if(res === 'b') {
	// 		board.rotateBoard();
	// 	}
	// 	if(res === 'b' || res === 'w')
	// 		board.setColor(res);
	// });
	
	// socket.on('connect',() => {
	//  	console.log('Timer');
	// });

	// socket.on('play-move',data => {
	// 	console.log('potatonopotato');
	// 	board.movePieceByServer(data);
	// });

	// function sendMoveToServer(originRank,originFile,destRank,destFile){
	// 	var jsonObject = {
	// 		originRank,
	// 		originFile,
	// 		destRank,
	// 		destFile
	// 	};
	// 	socket.emit('playing-move',jsonObject);
	// }

	
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
<!-- 	<Board size={70}  bind:this={board}/> -->
</div>
