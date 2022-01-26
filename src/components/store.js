import io from 'socket.io-client'
import { writable } from 'svelte/store';

const chatStore = writable('');

const socket = io('ws://localhost:8080');

// // Connection opened
// socket.addEventListener('open', function (event) {
//     console.log("It's open");
// });

// // Listen for messages
// socket.addEventListener('message', function (event) {
//     messageStore.set(event.data);
// });

socket.on('chat-message', (data) => {
    chatStore.set(data);
0  });  

// const sendMessage = (message) => {
// 	if (socket.readyState <= 1) {
// 		socket.send(message);
// 	}
// }

// document.querySelector('#send-button').onclick = () => 
function sendChatMessage(data) {
    // const text = document.querySelector('input').value;
    // let name = "Botnik"
    // data = {text, name}
    socket.emit('chat-message', data);
    console.log(data)
}

export default {
	subscribe: chatStore.subscribe,
	sendChatMessage
}


// --------------------- ADD DEFULT!
