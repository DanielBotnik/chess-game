
<script defer>
    import { debug } from "svelte/internal";
    
    
    let chat = null

</script>

<svelte:head>
    <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
</svelte:head>

<div class='chat' bind:this={chat}>
    <body>
    <div class="chatbox">
        <div class="top-bar">
            <div class="avatar"><p>D</p></div>
            <div class="name">Daniel Botnik</div>
            <div class="menu">
              <div class="dots"></div>
            </div>
        </div>



        <div class="middle">
            <div class="voldemort">
              <div class="incoming">
                <div class="bubble">Hey!</div>
                <br>
                <div class="bubble">New in here?</div>
                <br>
              </div>
              <div class="outgoing">
                <div class="bubble lower">Yeah, i'm a begginer</div>
                <br>
                <div class="bubble">Where are you from?</div>
                <br>
              </div>
              <div class="incoming">
                <div class="bubble">Israel</div>
                <br>
                <div class="bubble">You?</div>
                <br>
              </div>
              <div class="outgoing">
                <div class="bubble">Also!</div>
                <br>
                <div class="bubble">:)</div>
                <br>
              </div>
            </div>
          </div>




        <div class="bottom-bar">
            <div class="chat">
            <input type="text" placeholder="Type a message..." />
            <button type="submit"><ion-icon name="paper-plane"></ion-icon></button>
            </div>
        </div>
    </div>
</body>
</div>

<style>

    /* $font: 'Lato', sans-serif;

$primary: #79C7C5;
$secondary: #A1E2D9;
$white: #F9FBFF;
$dark: #777777; */


body {
  display: grid;
  font-family: 'Lato', sans-serif;
}

.chatbox {
  position: absolute; 
  top: 120px;
  right: 20px;
  height: 65%;
  width: 20%;
  border-radius: 10px;
  box-shadow: 5px 5px 15px rgba(#777777, 0.5);
}

.top-bar {
  width: 100%;
  height: 60px;
  background: #F9FBFF;
  border-radius: 10px 10px 0 0;
}

.avatar {
  width: 35px;
  height: 35px;
  background: linear-gradient(to bottom left, #79C7C5 20%, #A1E2D9 100%);
  border-radius: 50%;
  position: absolute;
  top: 11px;
  left: 15px;
}


.name {
  position: absolute;
  top: 22px;
  text-transform: uppercase;
  color: #777777;
  font-size: .8em;
  letter-spacing: 2px;
  font-weight: 500;
  left: 60px;
}

.menu {
  position: absolute;
  right: 10px;
  top: 20px;
  width: 10px;
  height: 20px;
  cursor: pointer;
}

.dots {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #79C7C5;
  box-shadow: 0px 7px 0px #79C7C5, 0px 14px 0px #79C7C5;
}




/* /////////////////////////// */


.middle {
  position: absolute;
  background: #F9FBFF;
  width: 100%;
  opacity: 0.85;
  top: 60px;
  height: 80%;
}

.incoming {
  /* position: absolute; */
  width: 50%;
  height: 100%;
  padding: 10px;
}

.incoming .bubble {
    /* background: lighten(#777777, 100%); */
    background-color: #777777;
  }

 
.bubble {
  position: relative;
  display: inline-block;
  margin-bottom: 5px;
  color: #F9FBFF;
  /* font-size: 0.7em; */
  /* padding: 10px 10px 10px 12px; */
    font-size: 0.9em; 
  padding: 10px 10px 10px 12px;
  border-radius: 20px;
} 

.lower {
  /* margin-top: 45px; */
}

.outgoing {
  /* position: absolute; */
  /* padding: 10px; */
  right: 0;
  /* top: 15%; */
  width: 100%;
  height: 100%;
  /* display:inline-block; */
}

.outgoing .bubble {
    background: #79C7C5;
    float: right;
  }

/* /////////////////////////// */

    .bottom-bar {
  position: absolute;
  width: 100%;
  height: 55px;
  bottom: 0;
  background: #F9FBFF;
  border-radius: 0 0 10px 10px;
}


input {
  padding: 7px;
  width: 74%;
  left: 5%;
  position: absolute;
  border: 0;
  top: 13px;
  background: #F9FBFF;
  color: #79C7C5;

}

input::placeholder {
  color: #A1E2D9;
}

input:focus {
  color: #777777;
  outline: 0;
}

button {
  position: absolute;
  border: 0;
  font-size: 1em;
  color: #A1E2D9;
  top:  19px;
  opacity: 0.8;
  right: 17px;
  cursor: pointer;
  outline: 0;
}

button:hover {
    transform: scale(1.1);
    transition: all .3s ease-in-out;
    color: #79C7C5;
  }





</style>