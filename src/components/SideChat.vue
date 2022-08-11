<template>
  <div class="bg-light rounded de w-100">
    <div class="p-2 w-100 d-flex flex-column">
      <div v-for="(msg, id) in messages" class="d-flex flex-column" :key="id">
        <router-link class="m-0 p-0 mb-1" :to="'/user/' + msg.from">{{
          msg.from
        }}</router-link>
        <p class="text-secondary m-0 p-0 mb-1">{{ msg.content }}</p>
        <hr class="w-auto" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

type TransMessage = {
  from: string;
  content: string;
};

const messages = ref([] as TransMessage[]);

onMounted(() => {
  // messages.value.push({ from: "tjolivea", content: "Coucou c'est moi!" });
  // messages.value.push({ from: "tjolivea", content: "Coucou c'est moi 2!" });
  // messages.value.push({ from: "kbarbry", content: "Yo" });
  // messages.value.push({ from: "tjolivea", content: "Yahouuu" });
  // messages.value.push({ from: "tjolivea", content: "Cool ce chat" });
  // messages.value.push({ from: "mdesoeuv", content: "Salut" });
  // messages.value.push({
  //   from: "tjolivea",
  //   content: "Coucou c'est moi encore!",
  // });
  // setInterval(
  //   () => messages.value.push({ from: "anonymous", content: "Haha" }),
  //   5000
  // );
});
</script>
