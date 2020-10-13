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
        submitInfo[1].disabled = false;
        submitInfo[1].placeholder = "Name";
    });

    function removeClass() {
        form.classList.remove('form-active');
        overlay.classList.remove('overlay-active');
    }

    window.onkeydown = (e) => {
        if (e.key === 'Escape') removeClass();
    };
    cancelButton.addEventListener('click', () => removeClass());
    overlay.addEventListener('click', () => removeClass());

    const submitInfo = document.querySelectorAll('input');

    const singlePlayer = document.querySelector('#computer');
    singlePlayer.addEventListener('change', () => {
        submitInfo[1].disabled = true;
        submitInfo[1].placeholder = "";
    });

    const multiPlayer = document.querySelector('#multiplayer');
    multiPlayer.addEventListener('change', () => {
        submitInfo[1].disabled = false;
        submitInfo[1].placeholder = "Name";
    });

    //add submit event for form to pull out values for the start of the game
    form.addEventListener('submit', (e) => {
        let gametype = 'multiplayer';
        //check which radio button(gametype) was checked
        if (submitInfo[2].checked) gametype = 'singleplayer';
        //start the game
        gametype === 'multiplayer' ? play(submitInfo[0].value, submitInfo[1].value) : play(submitInfo[0].value, 'Computer');
        //remove classes from form and overlay, reset form inputs and prevent form from refreshing the page
        removeClass();
        form.reset();
        e.preventDefault();
    });
    let i,
        player1,
        player2;
    //pull out squares from the display
    const squares = Array.from(document.querySelectorAll('.square'));
    let emptySquares;

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

        const announceWinner = (playerName) => {
            displayResult[0].textContent = playerName;
            displayResult[1].textContent = 'has';
            displayResult[2].textContent = 'won!';
            displayResult.forEach(headline => headline.classList.add('headline-active'));
            squares.forEach(square => square.removeEventListener('click', displayMove));
        };

        const checkWin = (name, sign) => {
            let tieCheck = 0;
            for (row in winningCombos[0]) {
                const counter = winningCombos[0][row].reduce((counter, square) =>
                    square.textContent === sign ? counter + 1 : counter, 0);
                if (counter === 3) {
                    winningCombos[0][row].forEach(square => square.classList.add('color-change'));
                    announceWinner(name);
                } else if ( counter !== 3 && i === 8) tieCheck++;
            }

            for (columnOrDiagonal in winningCombos[1]) {
                const counter = winningCombos[1][columnOrDiagonal].reduce((counter, square) => 
                    square.textContent === sign ? counter + 1 : counter, 0);
                if (counter === 3) {
                    winningCombos[1][columnOrDiagonal].forEach(square => square.classList.add('color-change'));
                    announceWinner(name);
                } else if ( counter !== 3 && i === 8) tieCheck++;
            }
            if (tieCheck === 8) announceTie();
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
                    if (displayResult[1].textContent === 'vs.') displayTurns[1].classList.add('turn-active');
                    displayTurns[0].classList.remove('turn-active');
                    if (player2.name === 'Computer' && displayResult[1].textContent === 'vs.') {
                        squares.forEach(square => square.removeEventListener('click', displayMove));
                        setTimeout(playAI, 1000);
                    }
                } else  {
                    e.target.textContent = "O";
                    checkWin(player2.name, player2.sign);
                    displayTurns[1].classList.remove('turn-active');
                    if (displayResult[1].textContent === 'vs.') displayTurns[0].classList.add('turn-active');
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

        function playAI() {
            let index;
            do {
                index = Math.floor(Math.random()*10);
                if (index === 9) index--;
            } while (squares[index].textContent !== "")
            console.log(index);
            squares[index].textContent = "O";
            checkWin(player2.name, player2.sign);
            displayTurns[1].classList.remove('turn-active');
            if (displayResult[1].textContent === 'vs.') displayTurns[0].classList.add('turn-active');
            i++;
            squares.forEach(square => square.addEventListener('click', displayMove));
        }
    }
})();