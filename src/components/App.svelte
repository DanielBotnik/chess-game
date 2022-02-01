<script lang="ts">
	import Board from './Board.svelte';
	import Clock from './Clock.svelte';
	import Chat from './Chat.svelte';
	import Start from './Start.svelte';

	import io from 'socket.io-client';
	
	// const socket = io('http://localhost:4919');
	let board;
	let clock;

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
	}

	function changeBoardFromClock(fen) {
		return board.changeBoard(fen);
	}

</script>
<div>
	<Clock bind:this={clock} changeBoard={changeBoardFromClock} />
	<Board bind:this={board} size={70} addClockMove={callClock} changeBoard={changeBoardFromClock}/>
	<Chat/>
<!-- 	<Board size={70}  bind:this={board}/> -->
</div>
