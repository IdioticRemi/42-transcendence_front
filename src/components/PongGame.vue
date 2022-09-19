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
      <router-link :class="`nav-link text-${myUserId === game.p1 ? 'primary' : 'danger'}`" :to="`/profile/${gameInfo.p1}`">{{
        gameInfo.p1Nick
      }}</router-link>
      <router-link :class="`nav-link text-${myUserId === game.p2 ? 'primary' : 'danger'}`" :to="`/profile/${gameInfo.p2}`">{{
        gameInfo.p2Nick
      }}</router-link>
    </div>
    <div ref="game_container" id="game_container" />
  </div>
  <!-- <div class="d-flex d-lg-none">
    Please connect on a larger screen to be able to play the amazing pong game!
  </div> -->
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

const frameRate = 60;

function interpolate(p5) {
  const tpsToFps = game.value.tps / frameRate;

  const playerPad =
    game.value.p1 === myUserId.value ? game.value.padLeft : game.value.padRight;
  const playerSpeed = playerPad.speed * tpsToFps;

  if (direction === "ArrowDown") {
    playerPad.y = Math.min(playerPad.y + playerSpeed, 100 - playerPad.height);
  } else if (direction === "ArrowUp") {
    playerPad.y = Math.max(playerPad.y - playerSpeed, 0);
  }

  game.value.ball.x += game.value.ball.velocityX * tpsToFps;
  game.value.ball.y += game.value.ball.velocityY * tpsToFps;
}

onMounted(() => {
  const script = function (p5) {
    p5.setup = (_) => {
      let pongCanvas = p5.createCanvas(1, 1, p5.WEBGL);
      pongCanvas.parent("game_container");

      p5.frameRate(frameRate);
    };

    p5.keyReleased = (_) => {
      if (gameEnd.value) return;
      if (["ArrowUp", "ArrowDown"].includes(p5.key)) {
        pressedKeys.delete(p5.key);
        if (pressedKeys.size === 0) {
          direction = "Stop";
          store.dispatch("game/sendMove", direction);
        }
      }
    };

    p5.keyPressed = (_) => {
      if (gameEnd.value) return;

      if (["ArrowUp", "ArrowDown"].includes(p5.key)) {
        pressedKeys.add(p5.key);
        direction = p5.key;
        store.dispatch("game/sendMove", direction);
      }
    };

    p5.draw = (_) => {
      if (
        !game.value ||
        !("ball" in game.value) ||
        !("padLeft" in game.value) ||
        !("padRight" in game.value) ||
        !("pause" in game.value) ||
        game.value.pause
      ) {
        // if (game.value.pause)
          // previousBall = null;
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
        interpolate(p5);
      } else {
        // console.log(previousBall.velocityX, previousBall.velocityY);
        previousBall = game.value.ball;
        // console.log(previousBall.velocityX, previousBall.velocityY);
      }

      const w = Math.max(Math.min(game_container.value?.offsetWidth, p5.windowHeight), 1);
      p5.resizeCanvas(w, Math.min(w, (w / 4) * 3));

      const scalingX = p5.width / 100;
      const scalingY = p5.height / 100;

      // 3D

      p5.rotateX(p5.PI / 6);
      p5.translate(-p5.width / 2, (-p5.height / 12) * 9, -p5.width / 6);

      // 2D
      // p5.translate(-p5.width / 2, -p5.height / 2);

      p5.background(0);

      // Back plane
      p5.push();

      p5.translate(0, 0, -5);
      p5.fill(30);
      p5.stroke(200);
      p5.rect(-5, -5, 100 * scalingX + 10, 100 * scalingY + 10);

      p5.pop();

      // Pads / Ball
      p5.fill(255);
      p5.stroke(30);

      p5.push();
      if (game.value.p1 === myUserId.value)
        p5.fill(62, 62, 255);
      else if (game.value.p2 === myUserId.value)
        p5.fill(255, 62, 62);
      p5.translate(
        game.value.padLeft.x * scalingX,
        game.value.padLeft.y * scalingY +
          (game.value.padLeft.height * scalingY) / 2,
        5
      );

      p5.box(
        game.value.padLeft.width * scalingX,
        game.value.padLeft.height * scalingY,
        game.value.padLeft.width * scalingX
      );
      // p5.rect(game.value.padLeft.x * scalingX, game.value.padLeft.y * scalingY, game.value.padLeft.width * scalingX, game.value.padLeft.height * scalingY);

      p5.pop();

      p5.push();
      if (game.value.p2 === myUserId.value)
        p5.fill(62, 62, 255);
      else if (game.value.p1 === myUserId.value)
        p5.fill(255, 62, 62);
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
      // p5.rect(game.value.padRight.x * scalingX, game.value.padRight.y * scalingY, game.value.padRight.width * scalingX, game.value.padRight.height * scalingY);

      p5.pop();

      p5.push();

      p5.noStroke();
      p5.translate(game.value.ball.x * scalingX, game.value.ball.y * scalingY);
      p5.sphere((game.value.ball.sizeX * scalingX) / 2);

      // p5.rect(game.value.ball.x * scalingX, game.value.ball.y * scalingY, game.value.ball.sizeX * scalingX, game.value.ball.sizeY * scalingY);

      p5.pop();
    };
  };
  new libP5(script);
});
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
