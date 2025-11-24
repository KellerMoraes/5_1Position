<template>
  <v-container height="100dvh" class="ma-0 pa-0 d-flex align-center">
    <v-card v-if="!params?.posicao" height="100%" class="d-flex flex-column align-center justify-center pa-2">
      <v-card-title>Selecione a posição</v-card-title>
      <v-card-text class="d-flex justify-space-around" style="flex-wrap: wrap;">
        <v-item-group class="mx-3" mandatory v-for='n in ["Ponteiro", "Central", "Oposto", "Levantador", "Líbero"]'
          :key="n">
          <v-card :color="n !== 'Ponteiro' ? '' : 'primary'" :disabled="n !== 'Ponteiro'" class="d-flex align-center px-2"
            height="100" dark @click="params.posicao = n">
            <v-scroll-y-transition>
              <div class="text-h3 flex-grow-1 text-center">
                {{ n }}
              </div>
            </v-scroll-y-transition>
          </v-card>
        </v-item-group>
      </v-card-text>
    </v-card>
    <v-card v-else height="100%" class="d-flex flex-column align-center justify-center px-2">
      <v-card-title>Selecione o modo</v-card-title>
      <v-card-text class="d-flex justify-space-around" style="flex-wrap: wrap;">
        <v-item-group class="mx-3" mandatory v-for='n in ["Recepcao", "Ataque", "Defesa", "Completo"]' :key="n">
          <v-card :color="n !== 'Recepcao' ? '' : 'primary'" :disabled="n !== 'Recepcao'" class="d-flex align-center"
            height="100" dark :to="`/${params.posicao}/${n}`">
            <v-scroll-y-transition>
              <div class="text-h3 flex-grow-1 text-center">
                {{ n }}
              </div>
            </v-scroll-y-transition>
          </v-card>
        </v-item-group>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
const params = ref({ posicao: null, variante: null })
</script>
<style lang="scss" scoped></style>
