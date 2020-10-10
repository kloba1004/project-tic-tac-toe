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
play()

function play(){
    //pull out squares from the display
    const squares = Array.from(document.querySelectorAll('.square'));

    //reset the squares
    squares.map(square => square.textContent = "");


    //logic for displaying each players move on screen and swapping between players 
    let i = 0;
    squares.forEach(square => square.addEventListener('click', (e) => {
        if (e.target.textContent === "") {
            if (i % 2 === 0) {
                e.target.textContent = "X";        
                player1.checkWin();
            } else {
                e.target.textContent = "O";
                player2.checkWin();
            }
            i++;
        }
    }));

    const winningCombos = (() => {
        //list all the possible winning combinations of rows/columns/diagonals into two objects, one for rows and second for rest
        const rowCombos = {},
              remainingCombos = {},
              //number of rows/columns of tic tac toe, thus n equals 3
              n = 3;
    
        //fill first object with rows
        for (let i = 0; i < n; i++) {
            rowCombos[`row${i+1}`] = squares.filter(element => (squares.indexOf(element) < squares.length/n + i*n) && (squares.indexOf(element) >= n*i));
        }
    
        //fill second object with columns
        for (let i = 0; i < n; i++) {
            const column = [];
    
            for (row in rowCombos) {
                column.push(rowCombos[row][i]); 
            }
            remainingCombos[`column${i+1}`] = column;
        }
    
        //fill second object with diagonals
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

        return [rowCombos, remainingCombos];
    })();

    function player(name, sign) {
        const getName = () => name;
        const getSign = () => sign;

        const checkWin = () => {
            for (row in winningCombos[0]) {
                const counter = winningCombos[0][row].reduce((counter, square) => square.textContent === getSign() ? counter + 1 : counter, 0);
                if (counter === 3) {
                    //reset the squares
                    squares.map(square => square.textContent = "");
                    announceWinner();
                }
            }

            for (key in winningCombos[1]) {
                const counter = winningCombos[1][key].reduce((counter, square) => square.textContent === sign ? counter + 1 : counter, 0);
                if (counter === 3) {
                    //reset the squares
                    squares.map(square => square.textContent = "");
                    announceWinner();
                }
            }
        };
        return {getName, checkWin}
    }
    const player1 = player('Ante', 'X');
    const player2 = player('Tina', 'O');

}