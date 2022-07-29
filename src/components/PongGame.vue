<template>
  <div class="canvas">
    <canvas
      id="pongCanvas"
      width="600"
      height="400"
      style="border: 1px solid black"
    ></canvas>
  </div>
  <input type="button" value="New Game" id="new-game-button" onclick="" />
</template>

<script>
export default {
  name: "PongGame",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&family=Press+Start+2P&display=swap");

body {
  background-color: rgb(194, 194, 194);
}

#pongCanvas {
  padding-left: 0;
  padding-right: 0;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background: black;
}

#new-game-button {
  color: black;
  font-family: "Press Start 2P", cursive;
  text-transform: uppercase;
  padding-left: 0;
  padding-right: 0;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background: white;
}
</style>

NavBar
