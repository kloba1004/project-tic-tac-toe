(() => {
    const startButton = document.querySelector('.start-button');
    const form = document.querySelector('.form');
    const overlay = document.querySelector('#overlay');
    const cancelButton = document.querySelector('.cancel-button');
    const displayResult = Array.from(document.querySelectorAll('.headline'));
    const displayTurns = document.querySelectorAll('.turn');

    startButton.addEventListener('click', () => {
        form.classList.add('form-active');
        overlay.className = 'overlay-active';
        displayResult.forEach(headline => headline.classList.remove('headline-active'));
    });

    function removeClass() {
        form.classList.remove('form-active');
        overlay.classList.remove('overlay-active');
    }

    cancelButton.addEventListener('click', () => removeClass());
    overlay.addEventListener('click', () => removeClass());

    const submitInfo = document.querySelectorAll('input');
    //add submit event for form to pull out values for the start of the game
    form.addEventListener('submit', (e) => {
        let i = 3;
        //check which radio button(gametype) was checked
        if (submitInfo[2].checked) i = 2;
        //start the game
        play(submitInfo[0].value, submitInfo[1].value)    
        //remove classes from form and overlay, reset form inputs and prevent form from refreshing the page
        removeClass();
        form.reset();
        e.preventDefault();
    });
    let i,
        player1,
        player;
    //pull out squares from the display
    const squares = Array.from(document.querySelectorAll('.square'));

    const winningCombos = (() => {
        //list all the possible winning combinations of rows/columns/diagonals into two objects, one for rows and second for rest
        const rowCombos = {},
            remainingCombos = {},
            //number of rows/columns of tic tac toe, thus n equals 3
            n = 3;
    
        //fill first object with rows
        for (let i = 0; i < n; i++) {
            rowCombos[`row${i+1}`] = squares.filter(element => 
                (squares.indexOf(element) < squares.length/n + i*n) && (squares.indexOf(element) >= n*i));
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

    function play(firstPlayer, secondPlayer){

        displayResult[0].textContent = firstPlayer;
        displayResult[1].textContent = 'vs.';
        displayResult[2].textContent = secondPlayer;
        startButton.textContent = 'restart';
        //create factory function to assign each player object his name, sign and checking of game state to 
        //announce his/her win in case of the  win after every move
        const announceWinner = (playerName) => {
            displayResult[0].textContent = playerName;
            displayResult[1].textContent = 'has';
            displayResult[2].textContent = 'won!';
            displayResult.forEach(headline => headline.classList.add('headline-active'));
            squares.forEach(square => square.removeEventListener('click', displayMove));
        };

        const checkWin = (name, sign) => {
            for (row in winningCombos[0]) {
                const counter = winningCombos[0][row].reduce((counter, square) =>
                    square.textContent === sign ? counter + 1 : counter, 0);
                if (counter === 3) {
                    winningCombos[0][row].forEach(square => square.classList.add('color-change'));
                    announceWinner(name);
                } else if ( counter !== 3 && i === 8) announceTie();
            }

            for (columnOrDiagonal in winningCombos[1]) {
                const counter = winningCombos[1][columnOrDiagonal].reduce((counter, square) => 
                    square.textContent === sign ? counter + 1 : counter, 0);
                if (counter === 3) {
                    winningCombos[1][columnOrDiagonal].forEach(square => square.classList.add('color-change'));
                    announceWinner(name);
                } else if ( counter !== 3 && i === 8) announceTie();
            }
        };

        function player(name, sign) {
            return {name, sign};
        }
        player1 = player(firstPlayer, 'X');
        player2 = player(secondPlayer, 'O');
        i = 0;

        //reset the squares
        squares.map(square => square.textContent = "");
        squares.forEach(square => square.classList.remove('color-change'));

        //logic for displaying each players move on screen and swapping between players as well as checking for the winner after each move
        displayTurns[0].textContent = `${player1.name}'s turn`;
        displayTurns[1].textContent = `${player2.name}'s turn`;
        displayTurns[0].classList.add('turn-active');
        displayTurns[1].classList.remove('turn-active');

        function displayMove(e) {
            if (e.target.textContent === "" && displayResult[1].textContent === 'vs.') {
                if (i % 2 === 0) {
                    e.target.textContent = "X";
                    checkWin(player1.name, player1.sign);
                     displayTurns[1].classList.add('turn-active');
                    displayTurns[0].classList.remove('turn-active');
                } else { 
                    e.target.textContent = "O";
                    checkWin(player2.name, player2.sign);
                    displayTurns[1].classList.remove('turn-active');
                    displayTurns[0].classList.add('turn-active');
                }
                i++;
            }
            
        }
        squares.forEach(square => square.addEventListener('click', displayMove));

        const announceTie = () => {
            displayResult[0].textContent = "It's";
            displayResult[1].textContent = 'a';
            displayResult[2].textContent = 'tie!';
            displayResult.forEach(headline => headline.classList.add('headline-active'));
            squares.forEach(square => square.removeEventListener('click', displayMove));
        }
    }
})();