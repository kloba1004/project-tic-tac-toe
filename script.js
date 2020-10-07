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

        //check which radio button was checked
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

