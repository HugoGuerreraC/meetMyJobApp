<template>
  <div class="h-screen w-screen">
    <NuxtPage />
  </div>
</template>

<script setup>
const colorMode = useColorMode();

colorMode.value = "light";
colorMode.preference = "light";
</script>

<style>
/* remove class dark form html */
html {
  background-color: #fff;
  color: #111827;
  font-family: "Nunito", sans-serif;
  color: #343f52;
}
</style>
