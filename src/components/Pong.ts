
type Position = {x: number, y: number};

let app: PIXI.Application;
let p1Score: number;
let p2Score: number;
let ball: PIXI.Graphics;
let ballSpeed: number;
let velocityX: number;
let velocityY: number;
let padLeft: PIXI.Graphics;
let padRight: PIXI.Graphics;

const stagedText: PIXI.Text[] = [];

import * as PIXI from "pixi.js";

function startScreen() {
  const style = new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 100,
    fontWeight: "bold",
    fill: "#ffffff",
  });
  const startPrompt = new PIXI.Text("PONG", style);
  startPrompt.anchor.set(0.5);
  startPrompt.x = app.view.width / 2;
  startPrompt.y = app.view.height / 2;

  stagedText.push(startPrompt);
  app.stage.addChild(stagedText[0]);
}

export function initPixi(pixiDom: any) {
  app = new PIXI.Application({
    width: 800,
    height: 600,
    antialias: true,
  });
  pixiDom.appendChild(app.view);
  startScreen();
}

function gameInit() {
  p1Score = 0;
  p2Score = 0;
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
  if (p2Score > p1Score)
    velocityX = ballSpeed * Math.cos(Math.PI / 4);
  else
    velocityX = - ballSpeed * Math.cos(Math.PI / 4);
  velocityY = ballSpeed * Math.sin(Math.PI / 4);
}

function createBall(size: number, color: number): PIXI.Graphics {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.drawRect(0, 0, size, size);
  g.endFill();
  return g;
}

function createPad(width: number, height: number, color: number): PIXI.Graphics {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.drawRect(0, 0, width, height);
  g.endFill();
  return g;
}

function checkWalls() {
  if ((ball.y <= 0 && velocityY < 0) || (ball.y + ball.height >= app.view.height && velocityY > 0))
    velocityY = -velocityY;
}

function checkPadLeft() {
  if (ball.x <= padLeft.x + padLeft.width && velocityX < 0) {
    if (ball.y + ball.height > padLeft.y && ball.y < padLeft.y + padLeft.height){
      const collidePoint = (ball.y + ball.width /2) - (padLeft.y + padLeft.height / 2);
       velocityX = Math.abs(ballSpeed * Math.cos( (collidePoint * Math.PI / 4) / (padLeft.height / 2) )); 
       velocityY = ballSpeed * Math.sin( (collidePoint * Math.PI / 4) / (padLeft.height / 2) ); 
       ballSpeed++;
      }
    }
  }
  
  function checkPadRight() {
    if (ball.x + ball.width >= padRight.x && velocityX > 0) {
      if (ball.y + ball.height > padRight.y && ball.y < padRight.y + padRight.height){
        const collidePoint = (ball.y + ball.width /2) - (padRight.y + padRight.height / 2);
        velocityX = - Math.abs(ballSpeed * Math.cos( (collidePoint * Math.PI / 4) / (padRight.height / 2) )); 
        velocityY = ballSpeed * Math.sin( (collidePoint * Math.PI / 4) / (padRight.height / 2) );
        ballSpeed++;
    }
  }
}

function checkWin() {
  if (ball.x <= 0)
  {
    p2Score++;
    setInit();
  }
  else if (ball.x + ball.width >= app.view.width)
  {
    p1Score++;
    setInit();
  }
}

function padRightAI() {
  padRight.y = ball.y - padRight.height / 2;
}

export function startGame() {
  app.stage.removeChild(stagedText[0]);
  stagedText[0].destroy();
  ball = createBall(20, 0xffffff);
  padLeft = createPad(10, 100, 0xffffff);
  padRight = createPad(10, 100, 0xffffff);
  app.stage.addChild(ball);
  app.stage.addChild(padLeft);
  app.stage.addChild(padRight);
  gameInit();
  padLeft.interactive = true;
  padLeft.on('pointermove', (event: PIXI.InteractionEvent) => {
    padLeft.y = event.data.global.y - padLeft.height / 2;
  });
  app.ticker.add( () => {
    checkWin();
    checkWalls();
    checkPadLeft();
    checkPadRight();
    padRightAI();
    ball.x += velocityX;
    ball.y += velocityY;
  }) 
}
