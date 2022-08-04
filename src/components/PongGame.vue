<template>
  <div ref="pixi"></div>
  <input
    type="button"
    value="New Game"
    id="new-game-button"
    @click="startPong()"
  />
</template>

<script>
import { initPixi, startGame } from "./Pong.ts";
export default {
  name: "PongGame",
  data() {
    return {};
  },
  methods: {
    startPong: function () {
      startGame();
    },
  },
  mounted() {
    initPixi(this.$refs.pixi);
  },
};
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
