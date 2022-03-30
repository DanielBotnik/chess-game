

<script>

let start
</script>


<div class='start' bind:this={start}>
    
    <head>
      <meta charset="utf-8">
      <title>Online Chess Timer</title>
      <link rel="stylesheet" href="style.css">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    
    <body>
      <div class="main-container">
        <div class="top-bar">
          <div class="main-header">
            <h1>Online chess Timer</h1>
          </div>
          <div class="info-nav">
            <h2>Info</h2>
          </div>
        </div>
        <div id="selection-container" class="selection-wrapper">
          <div class="game-selection">
            <div class="game-selection-tab">
              <h2>1m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>2m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>3m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>3m + 2s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>5m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>5m + 3s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>5m + 5s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>10m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>10m + 10s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>15m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>15m + 10s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>20m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>30m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>30m + 15s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>60m + 0s</h2>
            </div>
            <div class="game-selection-tab">
              <h2>Custom</h2>
            </div>
          </div>
        </div>
        <div class="game-wrapper" id="game-container">
          <div class="timers" id="timers-container">
            <div class="timer-wrapper whites-timer">
              <div class="time-info">
                <h2>White</h2>
                <h3 class="time-displayer" id="whites-displayer">00:00:00</h3>
              </div>
              <div class="rook" id="white-rook">
                <p>&#9820;</p>
              </div>
            </div>
            <div class="timer-wrapper blacks-timer">
              <div class="rook">
                <p id="black-rook">&#9820;</p>
              </div>
              <div class="time-info">
                <h2>Black</h2>
                <h3 class="time-displayer" id="blacks-displayer">00:00:00</h3>
              </div>
            </div>
          </div>
            <div class="change-sides-wrapper">
              <div class="change-sides-button" onclick="changeSides()">
                <p>change sides</p>
              </div>
            </div>
            <div class="tap-area-and-info">
              <p class="press-space-info" id="press-space-info">press space or click to change turn</p>
            </div>
            <div class="game-buttons">
              <div class="game-button" id="back-button">
                <h3>Back</h3>
              </div>
              <div class="game-button" id="restart-button">
                <h3>restart game</h3>
              </div>
              <div class="game-button" id="pause-button">
                <h3>pause game</h3>
              </div>
            </div>
        </div>
        <footer>
          <div class="footer-content">
            <p>Online chess timer by Michał Musioł</p>
          </div>
        </footer>
      </div>
      <script src="main.js" charset="utf-8"></script>
      <script src="playerTimer.js" charset="utf-8"></script>
    </body>
    
</div>

<style>
*{
  margin: 0;
  padding: 0;
}

body{
 background-color: #fff;
}

.main-container{
  display: grid;
  grid-template-rows: 2fr 12fr 1fr;
}

.top-bar{
  display: grid;
  grid-template-columns: 3fr 1fr;
  background-color: #fff;
  height: 60px;
  border-bottom-style: groove;
  border-color: #320D00;
  border-width: 1px;
}

.main-header{
  align-self: center;
  margin-left: 15%;
  color: #320D00;
}

.info-nav{
  display: grid;
  align-self: center;
  justify-self:center;
  background-color: #320D00;
  color: #fff;
  width: 100px;
  height: 60%;
  text-align: center;
  border-radius: 2px;
  border-style: groove;
  border-color: #320D00;
  border-width: 2px;
}

.info-nav h2{
  align-self: center;
}

.selection-wrapper{
  display: grid;
  height: 100%;
}

.game-selection{
  align-self: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  text-align: center;
  width: 80%;
  height: 100%;
  margin: auto;
}

.game-selection-tab{
  display: grid;
  background-color: #fff;
  color: #000;
  width: 90%;
  height: 15vh;
  text-align: center;
  margin: 1vw;
  border-style: groove;
  border-color: #320D00;
  border-width: 2px;
  border-radius: 5px;
  box-shadow: 3px 3px #320D00;
}

.game-selection-tab:hover{
  background-color: #320D00;
  color: #fff;
  box-shadow: none;
}

.game-selection-tab h2{
  align-self: center;
  font-size: 2.5vw;
}

.game-wrapper{
  display: none;
  margin: 0;
}

.timers{
  display: grid;
  grid-template-columns: 1fr 1fr;
  text-align: center;
  font-size: 2em;
}

.timers p{
  font-size: 3em;
}

.timer-wrapper{
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.time-info{
  align-self: center;
}

.time-displayer{
  align-self: center;
}

.whites-timer{
  background-color: #320D00;
  color: #fff;
}

.change-sides-wrapper{
  display: grid;
  margin-top: 5vh;
  height: 3rem;
}

.change-sides-button{
  display: grid;
  width: 20%;
  height: 100%;
  justify-self:center;
  align-self: center;
  border-style: groove;
  border-width: 1px;
  border-color: #320D00;
  text-align: center;
}

.change-sides-button p{
  align-self: center;
  font-size: 1.5rem;
}

.tap-area-and-info{
  text-align: center;
}

.press-space-info{
  margin-top: 1em;
}

.game-buttons{
  position: absolute;
  bottom: 10%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.game-button{
  display: grid;
  text-align: center;
  align-self: center;
  justify-self:center;
  background-color: #320D00;
  color: #fff;
  width: 120px;
  height: 50px;
}

.game-button h3{
  align-self: center;
}

footer{
  background-color: #320D00;
  color: #fff;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  height: 30px;
  border-top-style: solid;
  border-top-color: #320D00;
  border-top-width: 2px;
}

.footer-content{
  line-height: 30px;
  vertical-align: middle;
}

@media (max-width: 600px) {

  .main-header{
    margin-left: 15px;
  }

  .main-header h1{
    font-size: 1.5em;
  }

  .info-nav{
    width: 70px;
    height: 40%;
  }

  .game-selection{
    width: 95%;
  }

  .game-selection-tab{
    width: 95%;
    box-shadow: 1px 1px;
  }

  .game-selection-tab h2{
    vertical-align: center;
    font-size: 4vw;
  }

}

@media (max-height: 400px) {

    .main-container{
      grid-template-rows: 1fr 3fr 1fr;
    }

    .game-selection-tab{
      margin: 0 0;
      height: 90%;
      box-shadow: none none;
    }

    .game-selection-tab h2{
      vertical-align: center;
    }
}

</style>