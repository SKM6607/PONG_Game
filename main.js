"use strict";
let pt1Counter = 0,
  pt2Counter = 0,
  stopGame = false;
const WINPOINTMINIMUM = 5;
const canvas = document.getElementById("canvasIn");
const context = canvas.getContext("2d");
const playBtn = document.querySelector(".playBtn");
const playMenu = document.querySelector(".menu");
const howToBtn = document.querySelector(".howTo");
const howToModal = document.querySelector(".howToModal");
const hideHowTo = document.querySelector(".hidden");
const victoryDisplay = document.querySelector(".victoryMsg");
const displayWhoWon = document.querySelector(".displayVictory");
const scoresPlrs = document.querySelectorAll(".score");
const gitHubRedirect = document.querySelector(".gitHub");
playBtn.addEventListener("click", () => {
  togglePlayMenu();
  stopGame = false;
  gameLoop();
});
howToBtn.addEventListener("click", () => {
  toggleHowTo();
});
hideHowTo.addEventListener("click", () => toggleHowTo());
function toggleHowTo() {
  if (howToModal.classList.contains("gameShow")) {
    howToModal.classList.remove("gameShow");
    return;
  }
  howToModal.classList.add("gameShow");
}
function togglePlayMenu() {
  if (playMenu.classList.contains("Game")) {
    playMenu.classList.remove("Game");
    return;
  }
  playMenu.classList.add("Game");
}
function toggleVictoryMsg(victory) {
  if (victoryDisplay.classList.contains("noVictory")) {
    displayWhoWon.textContent = victory;
    victoryDisplay.classList.remove("noVictory");
    return;
  }
  victoryDisplay.classList.add("noVictory");
}
const paddleWidth = 5,
  paddleHeight = 40,
  ballRadius = 4,
  paddleSpeed = 3,
  velocityComponent = 2;
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: velocityComponent,
  vy: velocityComponent,
  radius: ballRadius,
};
const leftPaddle = {
  x: 10,
  y: (canvas.height - paddleHeight) / 2,
};
const rightPaddle = {
  x: canvas.width - 10 - paddleWidth,
  y: (canvas.height - paddleHeight) / 2,
};
const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};
document.addEventListener("keyup", (btn) => {
  if (btn.key in keys) keys[btn.key] = false;
});
document.addEventListener("keydown", (btn) => {
  if (btn.key in keys) keys[btn.key] = true;
});
function resetGameBoard() {
  pt1Counter =
    pt2Counter =
    scoresPlrs[0].textContent =
    scoresPlrs[1].textContent =
      0;
  leftPaddle.x = 10;
  rightPaddle.x = canvas.width - 10 - paddleWidth;
  leftPaddle.y = rightPaddle.y = (canvas.height - paddleHeight) / 2;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = velocityComponent;
  ball.vy = velocityComponent;
  ball.radius = ballRadius;
}
function gameMovement() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.vy *= -1;
  }
  if (
    ball.x - ball.radius < paddleWidth + leftPaddle.x &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + paddleHeight
  ) {
    ball.vx *= -1;
    ball.x = leftPaddle.x + paddleWidth + ball.radius;
  }
  if (
    ball.x + ball.radius > rightPaddle.x + paddleWidth &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + paddleHeight
  ) {
    ball.vx *= -1;
    ball.x = rightPaddle.x - ball.radius;
  }
  if (ball.x < 0 || ball.x > canvas.width) {
    if (ball.x < 0) {
      scoresPlrs[1].textContent = ++pt2Counter;
    }
    if (ball.x > canvas.width) {
      scoresPlrs[0].textContent = ++pt1Counter;
    }
    const player1Condition = pt1Counter >= WINPOINTMINIMUM;
    const player2Condition = pt2Counter >= WINPOINTMINIMUM;
    if (player1Condition || player2Condition) {
      player1Condition
        ? toggleVictoryMsg("Player 1 Wins!")
        : toggleVictoryMsg("Player 2 Wins!");
      setTimeout(toggleVictoryMsg, 2000, "none");
      resetGameBoard();
      togglePlayMenu();
      stopGame = true;
    }

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx *= -1;
    ball.vy = (Math.random() * 0.5 ? -1 : 1) * velocityComponent;
  }
  if (keys.w && leftPaddle.y > 0) leftPaddle.y -= paddleSpeed;
  if (keys.s && leftPaddle.y + paddleHeight < canvas.height)
    leftPaddle.y += paddleSpeed;
  if (keys.ArrowUp && rightPaddle.y > 0) rightPaddle.y -= paddleSpeed;
  if (keys.ArrowDown && rightPaddle.y + paddleHeight < canvas.height)
    rightPaddle.y += paddleSpeed;
}
function drawCanvas() {
  //basically sets up the things, draws canvas black!
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  //This thing below basically sets up the middle divider line
  context.strokeStyle = "white";
  context.setLineDash([3, 3]);
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();
  context.setLineDash([]);
  //Ball setup
  context.fillStyle = "white";
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fill();
  context.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
  context.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);
}
function gameLoop() {
  gameMovement();
  drawCanvas();
  if (stopGame) return;
  requestAnimationFrame(gameLoop);
}
gitHubRedirect.addEventListener("click", () => {
  window.open("https://github.com/SKM6607", "_current");
});
gameLoop();
