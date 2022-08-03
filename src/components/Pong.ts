let app: PIXI.Application;

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

  app.stage.addChild(startPrompt);
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

export function startGame() {
  console.log("START");
}
