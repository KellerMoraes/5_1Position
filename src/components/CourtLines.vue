<template>
  <v-group>
    <!-- Fundo da quadra -->
    <v-rect
      :config="{
        x: 0,
        y: 0,
        width,
        height,
        fill: '#F5F5F5',
        stroke: '#999',
        strokeWidth: 2,
        cornerRadius: 6
      }"
    />

    <!-- Rede (vertical dashed) -->
    <v-line
      :config="{
        points: [ netX, 0, netX, height ],
        stroke: '#444',
        strokeWidth: 3,
        dash: [10, 6]
      }"
    />

    <!-- Linha dos 3 metros (linha de ataque) - vertical sólida a 33% da "meia-quadra" -->
    <v-line
      :config="{
        points: [ attackX, 0, attackX, height ],
        stroke: '#444',
        strokeWidth: 2
      }"
    />

    <!-- Linhas auxiliares verticais para colunas (opcionais) -->
    <v-line
      v-for="xpc in [0.33, 0.66]"
      :key="'v'+xpc"
      :config="{
        points: [ width * xpc, 0, width * xpc, height ],
        stroke: '#eee',
        strokeWidth: 1
      }"
    />

    <!-- Linhas horizontais de referencia (opcionais) -->
    <v-line
      v-for="ypc in [0.25, 0.5, 0.75]"
      :key="'h'+ypc"
      :config="{
        points: [ 0, height * ypc, width, height * ypc ],
        stroke: '#eee',
        strokeWidth: 1
      }"
    />

    <!-- Labels de posições (orientado para rede à esquerda) -->
    <!-- Posições de fundo: 5,6,1 (à direita) -->
    <v-text :config="labelConfig(width * 0.78, height * 0.18, '5')" />
    <v-text :config="labelConfig(width * 0.78, height * 0.5, '6')" />
    <v-text :config="labelConfig(width * 0.78, height * 0.82, '1')" />

    <!-- Posições da rede: 4,3,2 (próximo à rede/esquerda) -->
    <v-text :config="labelConfig(width * 0.18, height * 0.18, '4')" />
    <v-text :config="labelConfig(width * 0.18, height * 0.5, '3')" />
    <v-text :config="labelConfig(width * 0.18, height * 0.82, '2')" />
  </v-group>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  netSide: { type: String, default: "left" } // 'left' | 'right'
});

/**
 * netX: posição X da rede (em px)
 * se netSide === 'left' => 10% da largura
 * se 'right' => 90% da largura
 */
const netX = computed(() => {
  return props.netSide === "left" ? props.width * 0.01 : props.width * 0.90;
});

/**
 * attackX: linha dos 3m (vertical) - distância da rede para dentro da quadra
 * Usamos 33% da largura "da meia quadra" medida a partir da rede.
 */
const attackX = computed(() => {
  if (props.netSide === "left") {
    return props.width * 0.10 + (props.width * 0.70) * 0.33; // entre net (10%) e margem direita (10%),
  } else {
    return props.width * 0.90 - (props.width * 0.70) * 0.33;
  }
});

function labelConfig(x, y, text) {
  const baseSize = Math.max(12, Math.round(props.width * 0.05));
  return {
    x,
    y: y - baseSize / 2,
    text,
    fontSize: baseSize,
    fontStyle: 'bold',
    fill: '#666',
    listening: false
  };
}
</script>
