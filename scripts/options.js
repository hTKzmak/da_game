const startGame = () => {
    toPlay = true;
    document.querySelector('.interface-container').style.display = "none";
    music.setVolume(0.5);
}

const showGameOver = () => {
    toPlay = false;
    document.querySelector('.interface-container').style.display = "flex";
    document.querySelector('.interface').innerHTML = showScore();
}

const retryGame = () => {
    toPlay = true;
    document.querySelector('.interface-container').style.display = "none";
    gameFuncs.retryGame();
}

const showScore = () => `
    <h1>Game over</h1>
    <h3>Score: ${score}</h3>
    <button onclick="retryGame()">Try again</button>
`;
