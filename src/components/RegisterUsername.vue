<template>
  <div>
    <div v-if="errors.length">
      <p v-for="(error, index) in errors" :key="index">
        {{ error }}
      </p>
    </div>
    <form id="Register" @submit="checkForm" onsubmit="return false">
      <label for="username">Username: </label>
      <input id="username" v-model="username" type="text" name="username" />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script>
export default {
  name: "RegisterUsername",
  data() {
    return {
      username: "",
      errors: [],
    };
  },
  methods: {
    checkForm() {
      console.log("username: ", this.username);
      this.errors = [];
      if (!this.username) {
        this.errors.push("Username required.");
        return;
      }
      const user = {
        username: this.username,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://127.0.0.1:8081",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify(user),
      };
      fetch("http://127.0.0.1:3000/users/register", options)
        .then(async (response) => {
          let json = await response.json();
          console.log(json);
          if (!response.ok) {
            return Promise.reject(json.message);
          }
        })
        .catch((error) => {
          console.log(error);
          this.errors.push(error);
        });
    },
  },
};
</script>
<style scoped></style>
