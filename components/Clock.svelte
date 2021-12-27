

<script defer>
import { debug } from "svelte/internal";


let clock = null
let firstClock = '00:00';
let firstName = 'Shira Madar';
let secondClock = '00:00';
let secondName = 'Daniel Botnik';
let turn = 0;
let data = [ ["1"] ]
let newRow
let lastTurn
	

    export function addMove(color, value) {
        if(color === 'w'){
            turn++
            if(turn==1){
                data = [["1", value]]
            }
            else {
                newRow = [turn, value]
                data = [[...newRow], ...data] 
            }
        }
        else{
            lastTurn = data.shift()
            lastTurn = [...lastTurn, value]
            data = [[...lastTurn], ...data] 
        }
	}

	
	function deleteRow(rowToBeDeleted) {
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
        <table class="moves">
            <tbody>
            {#each data as row}
                <tr>
                    {#each row as cell}
                    <button class="movebutton" on:click={() => deleteRow(row)}>
                    <td contenteditable="true" bind:innerHTML={cell} />
                    </button>
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
        top: 80px;
        left: 20px;
    }
p{
	font-family: 'Raleway',sans-serif;
    font-size: 22px;
}
h1{ 
	font-family: 'Raleway',sans-serif;
    font-size: 35px;
}
table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
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

</style>

