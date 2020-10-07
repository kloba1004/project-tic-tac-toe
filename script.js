const startButton = document.querySelector('.start-button');


//add click events for form opening/closing
startButton.addEventListener('click', () => {

    const form = document.querySelector('.form');
    const overlay = document.querySelector('#overlay');
    const cancelButton = document.querySelector('.cancel-button');
    
    //add classes to form and overlay    
    (() => {
        form.classList.add('form-active');
        overlay.className = 'overlay-active';
    })();

    function removeClass() {
        form.classList.remove('form-active');
        overlay.classList.remove('overlay-active');
    }

    cancelButton.addEventListener('click', () => removeClass());
    overlay.addEventListener('click', () => removeClass());

    //add submit event for form to pull out values for the start of the game
    form.addEventListener('submit', (e) => {
        const submitInfo = document.querySelectorAll('input');

        //factory function for creating  new pre-game information object
        function Game(player1, player2, gameType) {
            return { player1, player2, gameType };
        }

        //check which radio button was checked
        let i = 3;
        if (submitInfo[2].checked) i = 2;

        const gameInfo = Game(submitInfo[0].value, submitInfo[1].value, submitInfo[i].value);

        //remove classes from form and overlay, reset form inputs and prevent form from refreshing the page
        removeClass();
        form.reset();
        e.preventDefault();
    });
});




