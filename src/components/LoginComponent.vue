<template>
  <h2 v-if="failedLogin">Failed to authenticate, please retry !</h2>
  <h1>Welcome To Transcendence</h1>
  <a class="button" href="http://localhost:3000/auth">Proceed to login</a>
</template>

<script>
export default {
  name: "LoginComponent",
  methods: {},
  data() {
    return {
      failedLogin: false,
    };
  },
  mounted() {
    if (this.$route.query.login && this.$route.query.login == "false")
      this.failedLogin = true;
  },
};
</script>

<style scoped></style>
