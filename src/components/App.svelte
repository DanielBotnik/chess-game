<script>
	import Board from './Board.svelte';
	import io from 'socket.io-client';
	// const socket = io('http://localhost:4919');
	// socket.on('connect',() => {
	// 	console.log('Timer');
	// });

	
</script>
<div>
	<Board size={70} color={'w'} />
</div>
