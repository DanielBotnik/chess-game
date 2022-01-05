

<script defer>
import { debug } from "svelte/internal";


let clock = null
let firstClock = '00:00';
let firstName = 'Shira Madar';
let secondClock = '00:00';
let secondName = 'Daniel Botnik';
let turn = 0;
let data = [ ["1"] ]
let dataPointer = [1 , 1] //turn , white = 1 | black = 2
let dataCounter;
let dataFEN = [ ["1"] ] 
let newRow
let newFen
let lastTurn
let lastFen
	

    export function addMove(color, value, fen) {
        if(color === 'w'){
            turn++
            dataPointer = [turn , 1]
            if(turn==1){
                data = [["1", value]]
                dataFEN = [["1", fen]]
            }
            else {
                newRow = [turn, value]
                data = [...data, [...newRow]] 
                newFen = [turn, fen]
                dataFEN = [...data, [...newFen]] 
            }
        }
        else{
            dataPointer[1] = 2
            lastTurn = data.pop() //shift
            lastTurn = [...lastTurn, value]
            data = [...data, [...lastTurn]] 
            lastFen = dataFEN.pop() //shift
            lastFen = [...lastFen, fen]
            dataFEN = [...dataFEN, [...lastFen]] 
        }
        // markThePointer()
        // unmarkThePointer()
        //scrollToBottom('movesTable')
	}



    let t = 0
    export function markThePointer() {
        var table = document.getElementById('movesTable');
        var row = table.getElementsByTagName("tr")[dataPointer[0] - 1];
        var roww = data[dataPointer[0] - 1]
        var current = roww[dataPointer[1]]
        console.log("row from table="+row.innerText)
        console.log("row from data="+roww)
        console.log("current="+current)
        // var cell = row.getElementsByTagName("td")[t]
        // t++
        // cell.style.backgroundColor="#ADFF2F"
    }

    export function unmarkThePointer() {
        if(t>1){
        var table = document.getElementById('movesTable');
        var row = table.getElementsByTagName("tr")[0];
        var cell = row.getElementsByTagName("td")[t-2]
        cell.style.backgroundColor="transparent"
        }
    }



    function scrollToBottom(id) {
        //notWorking
        let table = document.getElementById(id)
        // alert(table.offsetHeight.valueOf()) - Thats the reason
        window.scrollBy({ 
            top: table.offsetHeight,
            behavior: 'smooth' 
        });

    }

    function clickOnMove() {
        alert(e.target.innerText); //current cell
    alert(e.target.parentNode.innerText); //Current row.
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
		<button class="btn"><i class="go to start"></i><ion-icon name="rewind"></ion-icon></button>
		<button class="btn"><i class="one back"></i><ion-icon name="skip-backward"></ion-icon></button>
		<button class="btn"><i class="one forward"></i><ion-icon name="skip-forward"></ion-icon></button>
		<button class="btn"><i class="go to end"></i><ion-icon name="fastforward"></ion-icon></button>
        <br>
        <table class="moves" id='movesTable'>
            <tbody>
            {#each data as row}
                <tr>
                    {#each row as cell}
                    <td>
                    <button class="movebutton" on:click={clickOnMove}>
                    <h3 contenteditable="true" bind:innerHTML={cell} />
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

