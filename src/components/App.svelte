<script>
	import Board from './Board.svelte';
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

	
</script>
<div>
	<Board size={70}  bind:this={board}/>
</div>
