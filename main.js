const startButton = document.querySelector("#startButton");
const startPage = document.querySelector(".startPage");
const gamePage = document.querySelector('.gamePage');
const resetButton = document.querySelector('#nextRoundButton');
const gameInfoContainer = document.querySelectorAll('.gameInfoContainer')

const Gameboard = (()=> {
    let gameboard = ["","","","","","","","","",];
    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class = "square" id="square-${index}">${square}</div>`
        })
        document.querySelector(".gameContainer").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener('click', Game.handleClick)
        })
    }
    const update = (index, value) => {
        if (gameboard[index] !== "")
        return;
        value = value === "X" ? `<svg xmlns="http://www.w3.org/2000/svg" height="100" viewBox="0 -960 960 960" width="100"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" fill="red"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" height="100" viewBox="0 -960 960 960" width="100"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" fill="#fbbf24"/></svg>`
        gameboard[index] = value; 
        render();
    }
    const reset = () => {
        displayController.resetMessageBox();
        gameboard = ["","","","","","","","","",];
    }
    const newGame = () => {
        displayController.resetMessageBox();
        displayController.resetScoreBox();
        if (Game.getPlayers()) {
            Game.getPlayers().forEach(player => {
                player.resetscore();
            });
        }
        gameboard = ["","","","","","","","","",]
        Game.resetTie();
    }
    const getGameboard = () => gameboard;

    return {
        newGame,
        render,
        update,
        reset,
        getGameboard,
    }
})();

const createPlayer = (sign, score) => {
    const getscore = () => score;
    const giveScore = () => score++;
    const resetscore = () => {
        return score = 0;
    }
    return {
        score,
        sign,
        giveScore,
        getscore,
        resetscore,
    };
}

const Game = (()=> {
    let players;
    let currentPlayerIndex;
    let gameOver = false;
    let roundOver = false;
    let tie = 0;

    const start = () => {
        if (!gameOver && !players) {
        players = [
          createPlayer("X", 0),
          createPlayer("O", 0),
        ]}
        currentPlayerIndex = 0;
        gameOver = false;
        roundOver = false;
        Gameboard.render();  
    }
    const resetTie = () =>{
        return tie = 0;
    }
    const handleClick = (event) => {
        if (roundOver) {
            return
        }
        let index = parseInt(event.target.id.split("-")[1]);

        Gameboard.update(index, players[currentPlayerIndex].sign);
        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].sign)) {
            roundOver = true;
            if (currentPlayerIndex === 0){
                players[0].giveScore();
                displayController.renderMessageforWin(`PLAYER ${players[0].sign} WIN!`, "#playerx",`${players[0].getscore()}`,"#playerxscore" )
                document.querySelector('#playerXinfo').style.backgroundColor = "red";
            } else if 
                    (currentPlayerIndex === 1) {
                    players[1].giveScore();
                    displayController.renderMessageforWin(`PLAYER ${players[1].sign} WIN!`, "#playero",`${players[1].getscore()}`,"#playeroscore" )
                    document.querySelector('#playerOinfo').style.backgroundColor = "#fbbf24";
                }
            } else if (checkForTie(Gameboard.getGameboard())) {
                tie ++;
                document.querySelector("#tiecore").innerHTML = tie;
                roundOver = true;
                displayController.renderMessageforTie("IT'S A TIE");
            }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }
    const getPlayers = () => players;
    const getscore = () => players[currentPlayerIndex].getscore();
    return {
        resetTie,
        start,
        handleClick,
        getPlayers,
        getscore,
    }
})();

const displayController = (()=> {
    const renderMessageforTie = (message) => {
        document.querySelector("#tieInfo").style.backgroundColor = "#34C3BE";
        document.querySelector("#tie").innerHTML = message;
    }
    const renderMessageforWin = (message,playerElementId,score,scoreElementId) => {
        document.querySelector(playerElementId).innerHTML = message;
        document.querySelector(scoreElementId).innerHTML = score;
    }
    const resetMessageBox = () =>{
        document.querySelector("#tie").innerHTML = "TIE"
        document.querySelector("#tieInfo").style.backgroundColor = "#374151"
        document.querySelector("#playerx").innerHTML = "PLAYER X";
        document.querySelector('#playerXinfo').style.backgroundColor = "#374151";
        document.querySelector("#playero").innerHTML = "PLAYER O";
        document.querySelector('#playerOinfo').style.backgroundColor = "#374151"; 
    }
    const resetScoreBox = () => {
        document.querySelector("#playerxscore").innerHTML = "";
        document.querySelector('#playeroscore').innerHTML = "";
        document.querySelector("#tiecore").innerHTML = "";
        document.querySelector("#tieInfo").style.backgroundColor = "#374151"
        document.querySelector('#playerXinfo').style.backgroundColor = "#374151";
        document.querySelector('#playerOinfo').style.backgroundColor = "#374151"; 
    }
    return {
        renderMessageforWin,
        resetMessageBox,
        renderMessageforTie,
        resetScoreBox,
    }
})();

function checkForTie(board) {
    return board.every(line => line !=="")
}
function checkForWin(board) {
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ]
    for (let i=0; i<winningCombinations.length; i++) {
        const [a,b,c] = winningCombinations[i];
        if (board[a] && board [a] === board [b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

startButton.addEventListener('click', () => {
    Game.start();
    startPage.style.display = "none";
    gamePage.style.display = "flex";
})

resetButton.addEventListener('click', () => {
    Gameboard.reset();
    Game.start();
})

newGameButton.addEventListener("click", () => {
    Gameboard.newGame();
    Game.start();
})