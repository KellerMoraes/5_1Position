<template>
  <v-card width="100%" class="d-flex justify-end pa-7">
    <v-card class="court" color="orange"
      style="border-left: 2px white solid;border-top: 2px white solid;border-bottom: 2px white solid;border-right: 8px white dashed; position: relative;">
      <div style="width: 3px; height: 100%; background-color: white; position: absolute; left: 62% "></div>
      <!-- HitBOXES -->
      <v-card v-for="box in hitboxes" @click="hit(box.id)" @tap="hit(box.id)" :width="box.W + '%'" :height="box.H + '%'"
        :location="box.L" flat tile position="absolute" color="rgb(0,0,0,0.2)"
        class="d-flex justify-center align-center">
        <v-overlay attach="#court" v-model="box.Focus">
        </v-overlay>
        <v-avatar color="primary" size="45" :style="{ 'z-index': box.Focus ? 2001 : 2 }">{{ box.id }}</v-avatar>
      </v-card>
    </v-card>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue"

const hitboxes = ref([
  { id: 1, W: 60, H: 32, L: "bottom left", Focus: false },
  { id: 2, W: 35, H: 32, L: "bottom right", Focus: false },
  { id: 3, W: 35, H: 32, L: "right center", Focus: false },
  { id: 4, W: 35, H: 32, L: "top right", Focus: false },
  { id: 5, W: 60, H: 32, L: "top left", Focus: false },
  { id: 6, W: 60, H: 32, L: "left center", Focus: false },

])

function hit(id) {
  console.log(id)
  let i = hitboxes.value.findIndex((b) => { return b.id == id })
  hitboxes.value[i].Focus = true
}

</script>

<style scoped>
.court-wrapper {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #222;
}

/* QUADRA RESPONSIVA */
.court {
  position: absolute;
  width: min(90vw, 90vh);
  /* sempre quadrado */
  height: min(90vw, 90vh);
  border: 2px solid white;
  border-right: 8px dashed white;
}

/* Linha central */
.center-line {
  position: absolute;
  left: 62%;
  top: 0;
  height: 100%;
  width: 3px;
  background: white;
}

/* HITBOXES */
.hitbox {
  position: absolute;
}

/* Overlay fica abaixo do token */
.overlay {
  z-index: 5;
}

/* Token SEMPRE acima */
.token {
  position: absolute;
  z-index: 10;
}
</style>
