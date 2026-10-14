const Player = (name,marker) => {
    return { name, marker };
};

const p1 = Player('Player 1', 'X');
const p2 = Player('Player 2', 'O');

const Gameboard = (() => {
    let gameState = ['', '', '', '', '', '', '', '', ''];
        const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
        ];

    function getBoard() {
        return gameState;
    }
    function placeMark(index, marker) {
            gameState[index] = marker;
    }
    function isCellEmpty(index) {
            return gameState[index] === '';
        }
    function checkWinner() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }
         return null;
    }
    function checkTie() {
    return !gameState.includes('') && checkWinner() === null;
        }
    function reset() {
            gameState = ['', '', '', '', '', '', '', '', ''];
        }

    return {
        getBoard,
        placeMark,
        isCellEmpty,
        checkWinner,
        checkTie,
        reset
    };
})();



const GameController = (() => {
    let currentPlayer = null;
    let gameActive = false; 
    let players=[];

    function startGame(p1, p2) {
        players = [p1, p2];
        currentPlayer = players[0];
        gameActive = true;
        Gameboard.reset();
        DisplayContent.renderBoard();
        DisplayContent.showMessage(`${currentPlayer.name}'s turn`);
    }

    function restartGame() {
        currentPlayer = players[0];
        gameActive = true;
        Gameboard.reset();
        DisplayContent.renderBoard();
        DisplayContent.showMessage(`${currentPlayer.name}'s turn`);
    }

    function getCurrentPlayer(){
        return currentPlayer;
    }

    function isGameActive() {
        return gameActive;
    }

    function playRound(index) {
        if (!gameActive || !Gameboard.isCellEmpty(index)) {
            return;
        }

        Gameboard.placeMark(index, currentPlayer.marker);
        DisplayContent.renderBoard();

        const winner = Gameboard.checkWinner();
        if (winner) {
            gameActive = false;
            DisplayContent.Result(`${currentPlayer.name} wins!`);
            DisplayContent.addScore(currentPlayer);
            return;
        }

        if (Gameboard.checkTie()) {
            gameActive = false;
            DisplayContent.Result("It's a tie!");
            return;
        }
        
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        DisplayContent.showMessage(`${currentPlayer.name}'s turn`);
    }


    return {
    startGame,
    restartGame,
    getCurrentPlayer,
    isGameActive,
    playRound
};
})();


const DisplayContent = (() => {
    const cells = document.querySelectorAll('.cells');
    const player1score = document.querySelector('#player1 .score');
    const player2score = document.querySelector('#player2 .score');
    const currentPlayerDisplay = document.querySelector('.current-player');
    const resetButton = document.querySelector('#reset');
    const startButton = document.querySelector('#start');

    startButton.addEventListener('click',() => {
        GameController.startGame(p1, p2);
    });

    resetButton.addEventListener('click', () => {
        GameController.restartGame();
    }); 

    function showMessage(message) {
        currentPlayerDisplay.textContent = message;
    }

    function addScore(player) {
        if (player === p1) {
            player1score.textContent = parseInt(player1score.textContent) + 1;
        } else if (player === p2) {
            player2score.textContent = parseInt(player2score.textContent) + 1;
        }
    }

    function Result(message) {
        const resultDisplay = document.querySelector('.result');
        resultDisplay.textContent = `Result is: ${message}`;
        
    }
    function renderBoard() {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });

    }
    
    cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        GameController.playRound(index);
    });
        });
    return {
        Result,
        renderBoard,
        showMessage,
        addScore
    };
})();



GameController.startGame(p1, p2);
 