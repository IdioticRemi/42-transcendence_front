<template>
  <div class="d-flex flex-column">
    <h1 v-if="!gameEnd">
      Score : {{ game?.p1Score || 0 }} - {{ game?.p2Score || 0 }}
    </h1>
    <div v-if="gameEnd">
      <h3>
        <span class="text-primary">{{ gameEnd.winnerNick }}</span> won the game
        <span class="text-primary">{{ gameEnd.winnerScore }}</span> to
        <span class="text-primary">{{ gameEnd.loserScore }}</span
        >!
      </h3>
    </div>
    <div v-if="gameInfo" class="d-flex justify-content-between w-100">
      <router-link
        :class="`nav-link text-${
          myUserId === gameInfo.p1 ? 'primary' : 'danger'
        }`"
        :to="`/profile/${gameInfo.p1}`"
        >{{ gameInfo.p1Nick }}</router-link
      >
      <router-link
        :class="`nav-link text-${
          myUserId === gameInfo.p2 ? 'primary' : 'danger'
        }`"
        :to="`/profile/${gameInfo.p2}`"
        >{{ gameInfo.p2Nick }}</router-link
      >
    </div>
    <div ref="game_container" id="game_container" />
  </div>
</template>

<script setup lang="ts">
import { store } from "@/store";
import { ref, onMounted, computed } from "vue";
import libP5 from "p5";

const game_container = ref(null);
const game = computed(() => store.state.game.gameData);
const gameEnd = computed(() => store.state.game.gameEnd);
const gameInfo = computed(() => store.state.game.gameInfo);
const myUserId = computed(() => store.state.auth.user?.id);

let direction = "Stop";
let previousBall = null;
let pressedKeys = new Set();
let bgImage = null;

const frameRate = 60;

function interpolate() {
  const tpsToFps = game.value.tps / frameRate;

  const playerPad =
    game.value.p1 === myUserId.value ? game.value.padLeft : game.value.padRight;
  const playerSpeed = playerPad.speed * tpsToFps;
  const direction = playerPad.reversed;

  if (direction === "ArrowDown") {
    playerPad.y = Math.min(
      Math.max(playerPad.y + playerSpeed * direction, 0),
      100 - playerPad.height
    );
  } else if (direction === "ArrowUp") {
    playerPad.y = Math.min(
      Math.max(playerPad.y - playerSpeed * direction, 0),
      100 - playerPad.height
    );
  }

  game.value.ball.x += game.value.ball.velocityX * tpsToFps;
  game.value.ball.y += game.value.ball.velocityY * tpsToFps;
}

onMounted(() => {
  const script = function (p5) {
    p5.setup = () => {
      let pongCanvas = p5.createCanvas(1, 1, p5.WEBGL);
      pongCanvas.parent("game_container");

      p5.frameRate(frameRate);
      bgImage = p5.loadImage("../pong_background.jpg");
    };

    p5.keyReleased = () => {
      if (gameEnd.value) return;
      if (["ArrowUp", "ArrowDown"].includes(p5.key)) {
        pressedKeys.delete(p5.key);
        if (pressedKeys.size === 0) {
          direction = "Stop";
          store.dispatch("game/sendMove", direction);
        }
      }
    };

    p5.keyPressed = () => {
      if (gameEnd.value) return;

      if (["ArrowUp", "ArrowDown"].includes(p5.key)) {
        pressedKeys.add(p5.key);
        direction = p5.key;
        store.dispatch("game/sendMove", direction);
      }
    };

    p5.draw = () => {
      if (
        !game.value ||
        !("ball" in game.value) ||
        !("padLeft" in game.value) ||
        !("padRight" in game.value) ||
        !("pause" in game.value) ||
        game.value.pause
      ) {
        return;
      }

      if (gameEnd.value) {
        return;
      }

      if (!previousBall) previousBall = game.value.ball;
      if (
        previousBall.x === game.value.ball.x &&
        previousBall.y === game.value.ball.y
      ) {
        interpolate();
      } else {
        previousBall = game.value.ball;
      }

      if (game.value.type === "custom") {
        p5.ambientLight(60, 60, 60);
        p5.shininess(50);
        p5.lightFalloff(1, 0, 0);
        p5.pointLight(255, 255, 255, 0, -p5.height / 4, 100);
        p5.specularMaterial(250, 50);
      }

      const w = Math.max(
        Math.min(game_container.value?.offsetWidth, p5.windowHeight),
        1
      );
      p5.resizeCanvas(w, Math.min(w, (w / 4) * 3));

      const scalingX = p5.width / 100;
      const scalingY = p5.height / 100;

      if (game.value.type === "classic") {
        p5.translate(-p5.width / 2, -p5.height / 2);
      } else {
        p5.rotateX(p5.PI / 6);
        p5.translate(-p5.width / 2, (-p5.height / 12) * 9, -p5.width / 6);
      }

      p5.background(0);

      // Back plane
      p5.push();
      p5.normalMaterial();
      p5.translate(0, 0, -5);
      if (game.value.type === "classic") {
        p5.fill(0);
        p5.stroke(255);
      } else {
        p5.fill(30);
        p5.stroke(200);
      }
      p5.rect(-5, -5, 100 * scalingX + 10, 100 * scalingY + 10);

      if (game.value.type === 'custom') {
        p5.noStroke();
        p5.translate(p5.width / 2, p5.height / 2, -6);
        p5.texture(bgImage);
        p5.plane(200 * scalingX, 200 * scalingY);
      }

      p5.pop();

      // LINES CENTER
      if (game.value.type === 'classic') {
        p5.push();
        p5.translate(0, 0, 0);
        for (let i = 0; i <= 100; i += 10) {
          p5.rect(
            49.5 * scalingX,
            i * scalingY,
            1 * scalingX,
            6 * scalingY
          );
        }
        p5.pop();
      }

      // Pads / Ball
      p5.fill(255);
      p5.stroke(30);

      p5.push();
      if (game.value.p1 === myUserId.value)
        p5.fill(62, 62, 255);
      else if (game.value.p2 === myUserId.value)
        p5.fill(255, 62, 62);

      if (game.value.type === "classic") {
        p5.rect(
          game.value.padLeft.x * scalingX,
          game.value.padLeft.y * scalingY,
          game.value.padLeft.width * scalingX,
          game.value.padLeft.height * scalingY
        );
      } else {
        p5.translate(
          game.value.padLeft.x * scalingX,
          game.value.padLeft.y * scalingY + (game.value.padLeft.height * scalingY) / 2,
          5
        );

        p5.box(
          game.value.padLeft.width * scalingX,
          game.value.padLeft.height * scalingY,
          game.value.padLeft.width * scalingX
        );
      }

      p5.pop();

      p5.push();
      if (game.value.p2 === myUserId.value) 
        p5.fill(62, 62, 255);
      else if (game.value.p1 === myUserId.value)
        p5.fill(255, 62, 62);

      if (game.value.type === "classic") {
        p5.rect(
          game.value.padRight.x * scalingX,
          game.value.padRight.y * scalingY,
          game.value.padRight.width * scalingX,
          game.value.padRight.height * scalingY
        );
      } else {
        p5.translate(
        game.value.padRight.x * scalingX,
        game.value.padRight.y * scalingY +
          (game.value.padRight.height * scalingY) / 2,
        5
        );

        p5.box(
          game.value.padRight.width * scalingX,
          game.value.padRight.height * scalingY,
          game.value.padLeft.width * scalingX
        );
      }

      p5.pop();

      p5.push();

      p5.noStroke();
      p5.fill(255);
      
      if (game.value.type === 'classic') {
        p5.rect(
          game.value.ball.x * scalingX,
          game.value.ball.y * scalingY,
          game.value.ball.sizeX * scalingX,
          game.value.ball.sizeY * scalingY
        );
      } else {
        p5.translate(game.value.ball.x * scalingX, game.value.ball.y * scalingY);
        p5.sphere((game.value.ball.sizeX * scalingX) / 2);
      }

      p5.pop();

      if (game.value.type === "custom") {
        if (game.value.triggerZone && game.value.triggerActive) {
          p5.push();

          p5.translate(
            game.value.triggerZone.x * scalingX +
              (game.value.triggerZone.width * scalingX) / 2,
            game.value.triggerZone.y * scalingY +
              (game.value.triggerZone.height * scalingY) / 2,
            (game.value.triggerZone.width / 12) * 7 * scalingX
          );
          p5.rotateY(p5.millis() / 1000);
          p5.noStroke();
          p5.fill(255, 223, 0);
          p5.torus(
            (game.value.triggerZone.width * scalingX) / 2,
            ((game.value.triggerZone.width * scalingX) / 2) * (5 / 12)
          );
          p5.pop();
        }
      }
    };
  };
  new libP5(script);
});
</script>

<style scoped>
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
