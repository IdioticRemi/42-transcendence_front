<template>
  <h1>Welcome To Transcendence</h1>
  <a class="button" href="http://localhost:3000/auth">Proceed to login</a>
</template>

<script>
export default {
  name: "HomeComponent",
  methods: {
    goLogin() {
      // this.$router.push("register");
      // location.replace(
      //   "https://api.intra.42.fr/oauth/authorize?client_id=1756d3ec1d32646782085a847ac19c071a87bf180406b8745b67ae9f1f982a59&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fauth%2F42Auth%2Fcallback&response_type=code);
    },
  },
};
</script>

<style scoped></style>
