<script defer>

import * as consts from '../assets/constants.js';

    let clock;
    let table;

    let firstClock = '00:00';
    let firstName = 'Shira Madar';
    let secondClock = '00:00';
    let secondName = 'Daniel Botnik';

    let currentTurn = 1;
    let shownTurn = 1;
    let moves = [];
    let boardFens = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'];

    export var changeBoard;


    export function addMove(color, value, fen) {
        if(currentTurn % 2)
            moves.push([value]);
        else {
            moves[Math.floor((currentTurn-1) / 2)].push(value);
        }
        moves = moves;
        boardFens.push(fen);
        currentTurn++;
        shownTurn = currentTurn;
    }

    function clickOnMove(index,color) {
        let newShownTurn = index * 2 + color + 2;
        if(shownTurn + 1 === newShownTurn) {
            oneTurnForward();
            return;
        }
        shownTurn = newShownTurn;
        changeBoard(boardFens[shownTurn-1]);
    }

    function oneTurnBack() {
        if(shownTurn < 2)
            return;
        shownTurn--;
        changeBoard(boardFens[shownTurn-1]);
    }

    function oneTurnForward() {
        if(shownTurn >= currentTurn)
            return;
        shownTurn++;
        changeBoard(boardFens[shownTurn-1]) ?
        new Audio(consts.CAPTURE_AUDIO).play() :
        new Audio(consts.MOVE_AUDIO).play();
    }

    function gotoCurrent() {
        shownTurn = currentTurn;
        changeBoard(boardFens[shownTurn-1]);
    }

    function gotoStart() {
        shownTurn = 1;
        changeBoard(boardFens[shownTurn-1]);
    }

</script>


<svelte:head>
    <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
</svelte:head>

<div class='clock' bind:this={clock}>
    <h1>{firstClock}</h1>
    <p>{firstName}</p>
    <br>
    <button class="btn"><i class="change sides"></i><ion-icon name="swap"></ion-icon></button>
    <button class="btn" on:click={gotoStart}><i class="go to start"></i><ion-icon name="rewind"></ion-icon></button>
    <button class="btn" on:click={oneTurnBack}><i class="one back"></i><ion-icon name="skip-backward"></ion-icon></button>
    <button class="btn" on:click={oneTurnForward}><i class="one forward"></i><ion-icon name="skip-forward"></ion-icon></button>
    <button class="btn" on:click={gotoCurrent}><i class="go to end"></i><ion-icon name="fastforward"></ion-icon></button>
    <br>
    <table class="moves" id='movesTable' bind:this={table}>
        <tbody>
        {#each moves as row,index}
            <tr>
                <td>{index+1}</td>
                {#each row as cell,color}
                <td>
                    <button class="movebutton" on:click={() => clickOnMove(index,color)}>
                        <h3 contenteditable="true" class:current-move={shownTurn-2 === index * 2 + color}>{cell}</h3>
                    </button>
                </td>
                {/each}
            </tr>
        {/each}
    </tbody>
    </table>
    <button class="btn"><i class="change sides"></i><ion-icon name="log-out"></ion-icon></button>
    <br>
    <br>
    <p>{secondName}</p>
    <h1>{secondClock}</h1>
    <br>
</div>


<style>
    .clock {
        position: absolute;
        top: 120px;
        left: 20px;
    }
p{
	/* font-family: 'Raleway',sans-serif; */
    font-family: 'Lato', sans-serif;
    font-size: 22px;
}
h1{ 
	font-family: 'Lato', sans-serif;
    font-size: 35px;
}
table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: 'Lato', sans-serif;;
    min-width: 320px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.moves thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

table, td {
    padding: 12px 15px;
    width: 100px;
}

table tbody tr {
    border-bottom: 1px solid #dddddd;
}


table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.moves button {
	border: none;
    background-color: transparent;
}

.moves button:hover {
  background-color: greenyellow;
}

.movebutton {
	border: none;
    background-color: transparent;
}

.current-move {
    background-color: #ADFF2F;
}

.movebutton:hover {
  background-color: greenyellow;
}



/* ----- icon buttons ----- */ 

.btn {
  background-color: #04AA6D;
  border: none;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  cursor: pointer;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: greenyellow;
}

/*scroll bar*/

thead, tbody { display: block; }

tbody {
    height: 170px;       /* Just for the demo          */
    overflow-y: auto;    /* Trigger vertical scroll    */
    overflow-x: hidden;  /* Hide the horizontal scroll */
}

.current {
    background-color: greenyellow;
}
</style>

