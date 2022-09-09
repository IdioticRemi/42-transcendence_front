<template>
  <div class="d-none d-lg-flex flex-column">
    <h1 v-if="!finished">score : {{ p1Score }} - {{ p2Score }}</h1>
    <h1 v-else>final score : {{ p1Score }} - {{ p2Score }}</h1>
    <div ref="game_container" id="game_container" />
  </div>
  <div class="d-flex d-lg-none">
    Please connect on a larger screen to be able to play the amazing pong game!
  </div>
</template>

<script setup lang="ts">
import { store } from "@/store";
import { ref, onMounted, computed } from "vue";
import libP5 from "p5";

const game_container = ref(null);
const game = computed(() => store.state.game.gameData);

const pressedKeys = new Set();

onMounted(() => {
  const script = function (p5) {
    p5.setup = (_) => {
      let pongCanvas = p5.createCanvas(1, 1, p5.WEBGL);
      pongCanvas.parent('game_container');

      p5.frameRate(60);
    };

    p5.keyReleased = (_) => {
      pressedKeys.delete(p5.key);
      if (p5.key === 'ArrowUp' && pressedKeys.has('ArrowDown'))
        return;
      if (p5.key === 'ArrowDown' && pressedKeys.has('ArrowUp'))
        return;
      if (['ArrowUp', 'ArrowDown'].includes(p5.key))
        store.dispatch('game/sendMove', 'Stop');
    }

    p5.keyPressed = (_) => {
      pressedKeys.add(p5.key);
      if (['ArrowUp', 'ArrowDown'].includes(p5.key))
        store.dispatch('game/sendMove', p5.key);
    }
  
    p5.draw = (_) => {
      const w = Math.max(game_container.value?.offsetWidth, 1);
      p5.resizeCanvas(w, Math.min(w, (w / 4) * 3));

      const scalingX = p5.width / 100;
      const scalingY = p5.height / 100;

      // 3D

      // p5.rotateX(p5.PI / 6);
      // p5.translate(-p5.width / 2, (-p5.height / 12) * 9, -p5.width / 6);

      // 2D
      p5.translate(-p5.width / 2, -p5.height / 2);10+

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
      // p5.translate(game.value.padLeft.x * scalingX, game.value.padLeft.y * scalingY, 5);

      // p5.box(
      //   game.value.padLeft.width * scalingX,
      //   game.value.padLeft.height * scalingY,
      //   game.value.padLeft.width * scalingX
      // );
      p5.rect(game.value.padLeft.x * scalingX, game.value.padLeft.y * scalingY, game.value.padLeft.width * scalingX, game.value.padLeft.height * scalingY);

      p5.pop();

      p5.push();
      // p5.translate(game.value.padRight.x * scalingX, game.value.padRight.y * scalingY, 5);

      // p5.box(
      //   game.value.padRight.width * scalingX,
      //   game.value.padRight.height * scalingY,
      //   game.value.padLeft.width * scalingX
      // );
      p5.rect(game.value.padRight.x * scalingX, game.value.padRight.y * scalingY, game.value.padRight.width * scalingX, game.value.padRight.height * scalingY);

      p5.pop();

      p5.push();

      p5.noStroke();
      // p5.translate(game.value.ball.x * scalingX, game.value.ball.y * scalingY);
      // p5.sphere((game.value.ball.size * scalingX) / 2);

      p5.rect(game.value.ball.x * scalingX, game.value.ball.y * scalingY, game.value.ball.size * scalingX, game.value.ball.size * scalingY);

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
