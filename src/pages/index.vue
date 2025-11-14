<template>
<v-container height="100vh" class="ma-0 pa-0 d-flex align-center" > 
<v-card v-if="!params?.posicao" class="d-flex flex-column align-center justify-center">
  <v-card-title>Selecione a posição</v-card-title>
  <v-card-text>
    <v-item-group mandatory>
    <v-container>
      <v-row>
        <v-col
          v-for='n in ["Ponteiro", "Central", "Oposto", "Levantador", "Líbero"]'
          :key="n"
          cols="12"
          md="2"
        >
          <v-item>
            <v-card
              color="secondary"
              class="d-flex align-center"
              height="100"
              dark
              @click="params.posicao = n"
            >
              <v-scroll-y-transition>
                <div
                  class="text-h3 flex-grow-1 text-center"
                >
                  {{ n }}
                </div>
              </v-scroll-y-transition>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
  </v-card-text>
</v-card>
<v-card v-else class="d-flex flex-column align-center justify-center">
  <v-card-title>Selecione o modo</v-card-title>
  <v-card-text>
    <v-item-group mandatory>
    <v-container>
      <v-row>
        <v-col
          v-for='n in ["Recepcao", "Ataque", "Defesa", "Completo"]'
          :key="n"
          cols="12"
          md="2"
        >
          <v-item>
            <v-card
              color="secondary"
              class="d-flex align-center"
              height="100"
              dark
              :to="`/${params.posicao}/${n}`"
            >
              <v-scroll-y-transition>
                <div
                  class="text-h3 flex-grow-1 text-center"
                >
                  {{ n }}
                </div>
              </v-scroll-y-transition>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
  </v-card-text>
</v-card>
</v-container>
</template>

<script setup>
const params = ref({posicao: null, variante: null })
</script>
<style lang="scss" scoped>

</style>
