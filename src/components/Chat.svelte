

<script defer lang="ts">
import type { ChatMessage } from '../types.js';
import store from './store.js';

    let chatInput: string;

    function clickOnSend(): void {
        store.sendChatMessage(chatInput);
        chatInput = '';
    }

    let messages: Array<ChatMessage> = [
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} ,
        {sender: 'Daniel',
        content: 'hello'} ,
        {sender: 'Shira',
        content: 'hi!'} 
      ];

</script>


<svelte:head>
    <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
</svelte:head>

<div class='chat'>
    <div class="top-bar">
        CHAT
    </div>
    <div class="middle">
        {#each messages as message}
            <div class="new-message"> 
                <div class="sender">
                    {message.sender}
                </div>
                <div class="content">
                    {message.content}
                </div>
            </div>
        {/each}
    </div>
    <div class="bottom-bar">
        <input type="content" placeholder="Type a message..." bind:value={chatInput}/>
        <button type="submit" id="send-button" on:click={clickOnSend}><ion-icon name="paper-plane"></ion-icon></button>
        <!-- להוסיף משתנה מהאינפוט -->
    </div>
</div>

<style>
    .chat {
  position: absolute; 
  top: 140px;
  right: 20px;
  height: 65%;
  width: 20%;
  border-radius: 10px;
  box-shadow: 5px 5px 15px rgba(#777777, 0.5);
  font-family: 'Lato', sans-serif;
}
    .top-bar{
        width: 100%;
        height: 30px;
        background-color: #04AA6D;
        color: #F9FBFF;
        text-align: center;
        vertical-align: middle;
        line-height: 30px;
    }

    .middle {
        position: absolute;
        background: #F9FBFF;
        width: 100%;
        opacity: 0.85;
        top: 30px;
        /* height: 80%; */
        height: 350px;
        overflow-y: auto;    /* Trigger vertical scroll    */
        overflow-x: hidden;  /* Hide the horizontal scroll */
        display: flex;
        flex-direction: column-reverse;
    }


    .new-message {
        padding: 5px;
    }

    .sender
    {
        font-weight: bold;
    }

    .sender, .content
    {
    display:inline;
    }

    .bottom-bar {
  position: absolute;
  width: 100%;
  height: 55px;
  top:380px;
  background: #F9FBFF;
}

input {
  padding: 7px;
  width: 74%;
  left: 5%;
  position: absolute;
  top: 13px;
  background: #F9FBFF;
  border: 1px solid #04AA6D;
  border-radius: 4px;
}

input:focus {
  outline: 0;
}

button {
  position: absolute;
  border: 0;
  font-size: 1.5em;
  top:  16px;
  right: 22px;
  cursor: pointer;
  outline: 0;
  background: #F9FBFF;
}

button:hover {
    transform: scale(1.1);
    transition: all .3s ease-in-out;
    color: #04AA6D;
  }


  ::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}



</style>