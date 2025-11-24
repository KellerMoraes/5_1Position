<template>
  <div >
    <v-app id="app-root">
      <router-view />
    </v-app>
  </div>
</template>

<script setup>
// const isPortrait = ref(false);

// function updateOrientation() {
//   isPortrait.value = window.innerHeight > window.innerWidth;
// }

// onMounted(() => {
//   updateOrientation();
//   window.addEventListener("resize", updateOrientation);
//   window.addEventListener("orientationchange", updateOrientation);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("resize", updateOrientation);
//   window.removeEventListener("orientationchange", updateOrientation);
// });
</script>

<style>

</style>