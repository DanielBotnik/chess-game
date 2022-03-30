import io from 'socket.io-client'
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { FullMove } from './types';

const chatStore: Writable<any> = writable(null);
const moveStore: Writable<any> = writable(null);

const socket = io('http://localhost:4919/game', {
    transports: ['websocket'],
});

socket.on('connect', () => {
    console.log('Connected');
})

socket.on('chat-message', (data) => {
    chatStore.set(JSON.parse(data));
});

socket.on('move-played', (move) => {
    moveStore.set(JSON.parse(move));
});
 
function sendChatMessage(content: string) : void {
    if(!content.length) return;
    socket.emit('chat-message', content);
}

function sendMoveToServer(move: FullMove) : void {
    socket.emit('move-played', move);
}

export default {
	onChatMessageRecived: chatStore.subscribe,
	sendChatMessage,
    onMoveRecived: moveStore.subscribe,
    sendMoveToServer,
}

