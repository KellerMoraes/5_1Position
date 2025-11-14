<template>
  <div class="flex justify-center items-center w-full h-full">
    <v-stage :config="{ width: stageWidth, height: stageHeight }">
      <v-layer>

        <!-- Fundo da quadra -->
        <v-rect
          :config="{
            x: 0,
            y: 0,
            width: courtSize,
            height: courtSize,
            fill: '#f97316'
          }"
        />

        <!-- Linha externa -->
        <v-rect
          :config="{
            x: 0,
            y: 0,
            width: courtSize,
            height: courtSize,
            stroke: 'white',
            strokeWidth: 3
          }"
        />

        <!-- Rede (lado direito) -->
        <v-line
          :config="{
            points: [courtSize, 0, courtSize, courtSize],
            stroke: 'white',
            strokeWidth: 3
          }"
        />

        <!-- Linha dos 3 metros (3m antes da rede, da direita p/ esquerda) -->
        <v-line
          :config="{
            points: [courtSize - (3 * scale), 0, courtSize - (3 * scale), courtSize],
            stroke: 'white',
            strokeWidth: 2,
            dash: [12, 8]
          }"
        />

      </v-layer>
    </v-stage>
  </div>
</template>

<script setup>
const scale = 50 // 1 metro = 50px

// meia quadra 9x9
const courtSize = 9 * scale

// stage = tamanho da quadra
const stageWidth = courtSize
const stageHeight = courtSize
</script>
