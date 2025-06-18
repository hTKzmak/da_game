function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\ sce|palm/i.test(
    userAgent
  );
}

const showGameIntro = () => {
  document.body.querySelector('.container').innerHTML = showIntro;
}

const startGame = () => {
  gameFuncs.startGame();
  document.querySelector(".interface-container").style.display = "none";

  if (isMobile()) {
    document.querySelector(".container").appendChild(controlsContainer);
  }
};

const showGameOver = () => {
  toPlay = false;
  document.querySelector(".interface-container").style.display = "flex";
  document.querySelector(".interface").innerHTML = showScore();

  if (isMobile()) {
    document.querySelector(".controls-container").style.opacity = 0;
  }
};

const retryGame = () => {
  document.querySelector(".interface-container").style.display = "none";
  gameFuncs.retryGame();

  if (isMobile()) {
    document.querySelector(".controls-container").style.opacity = 1;
  }
};

const showScore = () => `
    <h1>Game over</h1>
    <h3>Score: ${score}</h3>
    <button onclick="retryGame()">Try again</button>
`;

const showIntro = `
    <div class="interface-container">
      <div class="interface">
        <h1>Da game</h1>
        <button onclick="startGame()">Play</button>
      </div>
    </div>
`;