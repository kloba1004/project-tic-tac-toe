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
let winningCombos = ['012', '036', '048', '147', '246', '258', '345', '678'];

let playerX = ['0', '3', '2', '7', '8'];

if (playerX.includes('0')) {
    if (playerX.includes('1') && playerX.includes('2')) console.log('someone won');
    if (playerX.includes('3') && playerX.includes('6')) console.log('someone won');
    if (playerX.includes('4') && playerX.includes('8')) console.log('someone won');
}

if (playerX.includes('1')) {
    if (playerX.includes('4') && playerX.includes('7')) console.log('someone won');
}

if (playerX.includes('2')) {
    if (playerX.includes('4') && playerX.includes('6')) console.log('someone won');
    if (playerX.includes('5') && playerX.includes('8')) console.log('someone won');
}

if (playerX.includes('3')) {
    if (playerX.includes('4') && playerX.includes('5')) console.log('someone won');
}

if (playerX.includes('6')) {
    if (playerX.includes('7') && playerX.includes('8')) console.log('someone won');
}