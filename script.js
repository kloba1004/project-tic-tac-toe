const startButton = document.querySelector('.start-button');


//add click events for form opening/closing
startButton.addEventListener('click', () => {
    const form = document.querySelector('.form');
    const overlay = document.querySelector('#overlay');
    const cancelButton = document.querySelector('.cancel-button');
    
    form.classList.add('form-active');
    overlay.className = 'overlay-active';

    function removeClass() {
        form.classList.remove('form-active');
        overlay.classList.remove('overlay-active');
    }

    cancelButton.addEventListener('click', () => removeClass());
    overlay.addEventListener('click', () => removeClass());

    //add submit event for form to pull out values for the start of the game
    form.addEventListener('submit', (e) => {
        const submitInfo = document.querySelectorAll('input');

        //check which radio button(gametype) was checked
        let i = 3;
        if (submitInfo[2].checked) i = 2;

        //new game information to use for starting the game
        const gameInfo = {
            player1 : submitInfo[0].value,
            player2 : submitInfo[1].value,
            gameType : submitInfo[i],
        }

        //remove classes from form and overlay, reset form inputs and prevent form from refreshing the page
        removeClass();
        form.reset();
        e.preventDefault();
    });
});


const squares = Array.from(document.querySelectorAll('.square'));

//reset the game
squares.map(square => square.textContent = "");


//logic for swapping between players
let i = 0;
squares.forEach(square => square.addEventListener('click', (e) => {
    if (e.target.textContent === "") {
        i % 2 === 0 ? e.target.textContent = "X" : e.target.textContent = "O";
        i++;
    }
}))

//logic for continuous check if someone has won
const rowCombos = {},
      remainingCombos = {},
      n = 3,
      array = [0,1,2,3,4,5,6,7,8];



//create an object which containes row combinations possible for the win
for (i = 0; i < n; i++) {
    rowCombos[`row${i+1}`] = array.filter(element => array.indexOf(element) < (array.length/n + i*n) && (array.indexOf(element) >= n*i));
}

//create second object which containes column combinations possible for the win
for (i = 0; i < n; i++) {
    const column = [];

    for (row in rowCombos) {
        column.push(rowCombos[row][i]); 
    }
    remainingCombos[`column${i+1}`] = column;
}

//place diagonal combinations possible for the win in the second object too
const diagonal1 = [],
      diagonal2 = [];

let counter1 = 0,
    counter2 = n - 1;

for (row in rowCombos) {
    diagonal1.push(rowCombos[row][counter1]);
    counter1++;

    diagonal2.push(rowCombos[row][counter2]);
    counter2--;
}

remainingCombos.diagonal1 = diagonal1;
remainingCombos.diagonal2 = diagonal2;


console.table(rowCombos)
console.table(remainingCombos)
