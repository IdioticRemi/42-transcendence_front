<template>
  <div>
    <router-view />
    <nav>
      <router-link to="/home">Home</router-link> |
      <router-link to="/">Login</router-link> |
      <router-link to="/pong">Pong</router-link> |
      <router-link to="/profile">Profile</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavBar",
};
</script>

<style scoped></style>
