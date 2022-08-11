<template>
  <div class="d-none d-lg-flex flex-column">
    <h1 v-if="finished == false">score : {{ p1Score }} - {{ p2Score }}</h1>
    <h1 v-else>final score : {{ p1Score }} - {{ p2Score }}</h1>
    <div ref="pixi"></div>
  </div>
  <div class="d-flex d-lg-none">
    Please connect on a larger screen to be able to play the amazing pong game!
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as PIXI from "pixi.js";

const pixi = ref(null);

onMounted(() => {
  if (pixi.value) initPixi(pixi.value);
});

let app: PIXI.Application;
const p1Score = ref(0);
const p2Score = ref(0);
let ball: PIXI.Graphics;
let ballSpeed: number;
let velocityX: number;
let velocityY: number;
let padLeft: PIXI.Graphics;
let padRight: PIXI.Graphics;
let p1ScoreText: PIXI.Text;
let p2ScoreText: PIXI.Text;
let finished = ref(false);
const scoreMax = 3;

function startScreen() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 140,
    fontWeight: "bold",
    fill: "#ffffff",
  });
  const startPrompt = new PIXI.Text("PONG", style);
  startPrompt.anchor.set(0.5);
  startPrompt.x = app.view.width / 2;
  startPrompt.y = app.view.height / 2;
  startPrompt.interactive = true;

  startPrompt.on("mousedown", startNewGame);

  app.stage.addChild(startPrompt);
}

function displayScore() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 80,
    fill: "#ffffff",
  });
  p1ScoreText = new PIXI.Text(p1Score.value.toString(), style);
  p2ScoreText = new PIXI.Text(p2Score.value.toString(), style);
  p1ScoreText.anchor.set(0.5);
  p1ScoreText.x = app.view.width / 4;
  p1ScoreText.y = app.view.height / 4;
  p2ScoreText.anchor.set(0.5);
  p2ScoreText.x = (app.view.width * 3) / 4;
  p2ScoreText.y = app.view.height / 4;
  app.stage.addChild(p1ScoreText);
  app.stage.addChild(p2ScoreText);
}

function displayWinner() {
  finished.value = true;
  app.ticker.remove(gameLoop);
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 50,
    fill: "#ffffff",
  });
  let winner: string;
  if (p1Score.value > p2Score.value) winner = "Player 1";
  else winner = "Player 2";
  const winText = new PIXI.Text(winner + " wins !", style);
  winText.anchor.set(0.5);
  app.stage.addChild(winText);
  winText.x = app.view.width / 2;
  winText.y = app.view.height / 2;

  const restartText = new PIXI.Text("PRESS TO RESTART", style);
  restartText.interactive = true;
  restartText.anchor.set(0.5);
  restartText.x = app.view.width / 2;
  restartText.y = (app.view.height * 3) / 4;
  restartText.on("mousedown", startNewGame);
  app.stage.addChild(restartText);
}

function gameInit() {
  p1Score.value = 0;
  p2Score.value = 0;
  setInit();
}

function setInit() {
  padLeft.x = 20;
  padLeft.y = app.view.height / 2 - padLeft.height / 2;
  padRight.x = app.view.width - 20 - padRight.width;
  padRight.y = app.view.height / 2 - padRight.height / 2;
  ball.x = app.view.width / 2 - ball.width / 2;
  ball.y = 10;
  ballSpeed = 5;
  if (p2Score.value > p1Score.value)
    velocityX = ballSpeed * Math.cos(Math.PI / 4);
  else velocityX = -ballSpeed * Math.cos(Math.PI / 4);
  velocityY = ballSpeed * Math.sin(Math.PI / 4);
}

function createBall(size: number, color: number): PIXI.Graphics {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.drawRect(0, 0, size, size);
  g.endFill();
  return g;
}

function createPad(
  width: number,
  height: number,
  color: number
): PIXI.Graphics {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.drawRect(0, 0, width, height);
  g.endFill();
  return g;
}

function checkWalls() {
  if (
    (ball.y <= 0 && velocityY < 0) ||
    (ball.y + ball.height >= app.view.height && velocityY > 0)
  )
    velocityY = -velocityY;
}

function checkPadLeft() {
  if (ball.x <= padLeft.x + padLeft.width && velocityX < 0) {
    if (
      ball.y + ball.height > padLeft.y &&
      ball.y < padLeft.y + padLeft.height
    ) {
      const collidePoint =
        ball.y + ball.width / 2 - (padLeft.y + padLeft.height / 2);
      velocityX = Math.abs(
        ballSpeed *
          Math.cos((collidePoint * Math.PI) / 4 / (padLeft.height / 2))
      );
      velocityY =
        ballSpeed *
        Math.sin((collidePoint * Math.PI) / 4 / (padLeft.height / 2));
      ballSpeed++;
    }
  }
}

function checkPadRight() {
  if (ball.x + ball.width >= padRight.x && velocityX > 0) {
    if (
      ball.y + ball.height > padRight.y &&
      ball.y < padRight.y + padRight.height
    ) {
      const collidePoint =
        ball.y + ball.width / 2 - (padRight.y + padRight.height / 2);
      velocityX = -Math.abs(
        ballSpeed *
          Math.cos((collidePoint * Math.PI) / 4 / (padRight.height / 2))
      );
      velocityY =
        ballSpeed *
        Math.sin((collidePoint * Math.PI) / 4 / (padRight.height / 2));
      ballSpeed++;
    }
  }
}

function checkWin() {
  if (ball.x <= 0) {
    p2Score.value++;
    p2ScoreText.text = p2Score.value.toString();
    if (p2Score.value !== scoreMax) setInit();
  } else if (ball.x + ball.width >= app.view.width) {
    p1Score.value++;
    p1ScoreText.text = p1Score.value.toString();
    if (p1Score.value !== scoreMax) setInit();
  }
}

function padRightAI() {
  padRight.y = ball.y - padRight.height / 2;
}

// function clearStage() {
//   app.stage.removeChildren();
//   ball.destroy();
//   padLeft.destroy();
//   padRight.destroy();
// }

function gameLoop() {
  checkWin();
  if (p1Score.value === scoreMax || p2Score.value === scoreMax) {
    app.ticker.stop();
    displayWinner();
  }
  checkWalls();
  checkPadLeft();
  checkPadRight();
  padRightAI();
  ball.x += velocityX;
  ball.y += velocityY;
}

function startNewGame() {
  app.stage.removeChildren();
  app.ticker.add(gameLoop);
  app.ticker.start();
  app.stage.addChild(ball);
  app.stage.addChild(padLeft);
  app.stage.addChild(padRight);
  gameInit();
  padLeft.interactive = true;
  padLeft.on("pointermove", (event: PIXI.InteractionEvent) => {
    padLeft.y = event.data.global.y - padLeft.height / 2;
  });
  finished.value = false;
  displayScore();
}

function initPixi(pixiDom: HTMLElement) {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
  });
  pixiDom.appendChild(app.view);
  ball = createBall(20, 0xffffff);
  padLeft = createPad(10, 100, 0xffffff);
  padRight = createPad(10, 100, 0xffffff);
  app.ticker.autoStart = false;
  startScreen();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Press+Start+2P&display=swap");

body {
  background-color: rgb(194, 194, 194);
}

#new-game-button {
  color: black;
  font-family: "Press Start 2P", cursive;
  text-transform: uppercase;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  width: 800px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background: white;
}
</style>
