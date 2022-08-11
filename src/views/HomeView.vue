<template>
  <div>
    <h1>This is the home page!</h1>
    <p>Let's have some fun :D</p>
    <button @click="test" class="btn btn-outline-secondary">Clique moi!</button>
  </div>
</template>

<script setup>
function test() {
  alert("lol");
}
</script>
