<template>
  <div class="orientation-wrapper" :class="{ rotated: isPortrait }">
    <v-app id="app-root">
      <router-view />
    </v-app>
  </div>
</template>

<script setup>
const isPortrait = ref(false);

function updateOrientation() {
  isPortrait.value = window.innerHeight > window.innerWidth;
}

onMounted(() => {
  updateOrientation();
  window.addEventListener("resize", updateOrientation);
  window.addEventListener("orientationchange", updateOrientation);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateOrientation);
  window.removeEventListener("orientationchange", updateOrientation);
});
</script>

<style>
/* Wrapper que pode virar landscape forçado */
.orientation-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #000;
}

/* Conteúdo normal */
.app-content {
  width: 100%;
  height: 100%;
}

/* Quando o celular está em PORTRAIT → rotacionar o app inteiro */
.orientation-wrapper.rotated .app-content {
  transform: rotate(-90deg);
  transform-origin: center center;

  /* Agora o width vira height e height vira width */
  width: 100vh;
  height: 100vw;

  /* Centralizar */
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
}
</style>