<template>
<v-container height="100vh" class="d-flex justify-center align-center"> 
  <div style="background-color: orangered; height: 90vh; width: 60vw; position: relative;border-top: white 10px dashed; overflow: hidden;" class="pt-1">
    <div style="position: absolute; bottom: 60%; background-color:white ; width: 100%; height: 10px;"></div>
    <div style="height: 40%; width: 100%;">
       <v-item-group style="height: 100%;" selected-class="bg-primary">
    <v-container height="100%">
      <v-row style="height: 100%;">
        <v-col
          v-for="n in [3,2,1]"
          :key="n"
          cols="12"
          class="pa-1"
          md="4"
        >
          <v-item v-slot="{ isSelected, selectedClass, toggle }">
            <v-card
              :class="['d-flex align-center', selectedClass]"
              style="height: 100%; opacity: 0.8;"
              dark
              @click="toggle"
            >
              <div
                class="text-h3 flex-grow-1 text-center"
              >
              <v-avatar color="black" size="80" :class="`positionAvatar pos${n} ${selectedClass? 'move': ''} `">
                {{ n }}
              </v-avatar>
              </div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

    </div>
    <div style=" height: 65%; width: 100%;">
     <v-item-group style="height: 100%;" selected-class="bg-primary">
    <v-container height="100%">
      <v-row style="height: 100%;">
        <v-col
          v-for="n in [4,5,6]"
          :key="n"
          cols="12"
          class="pa-1"
          md="4"
        >
          <v-item v-slot="{ isSelected, selectedClass, toggle }">
            <v-card
              :class="['d-flex align-center', selectedClass]"
              style="height: 100%; opacity: 0.8;"
              @click="toggle"
            >
              <div
                class="text-h3 flex-grow-1 text-center"
              >
                <v-avatar color="black" size="80" :class="`positionAvatar pos${n} ${selectedClass? 'move': ''} `">
                {{ n }}
              </v-avatar>
              </div>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

    </div>
  </div>
</v-container>
</template>

<script setup>
  //
</script>
<style lang="scss" scoped>
.positionAvatar {
  position: relative;
  transition: transform 0.6s ease-in-out;

  &.move {
    &.pos1  { animation: ponteiro_pos1_recepcao 1.5s ease-in-out forwards; }
    &.pos2  { animation: ponteiro_pos2_recepcao 1.5s ease-in-out forwards; }
    &.pos3  { animation: ponteiro_pos3_recepcao 1.5s ease-in-out forwards; }
    &.pos4  { animation: ponteiro_pos4_recepcao 1.5s ease-in-out forwards; }
    &.pos5  { animation: ponteiro_pos5_recepcao 1.5s ease-in-out forwards; }
    &.pos6  { animation: ponteiro_pos6_recepcao 1.5s ease-in-out forwards; }
  }

  &:not(.move) {
    transform: translate(0, 0);
  }
}

/* ===============================
   ANIMAÇÕES — PONTEIRO RECEBENDO SAQUE
   =============================== */

/* 1 → desloca pra centro do fundo (posição 6) */
@keyframes ponteiro_pos1_recepcao {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-8vw, 5vh); }
  100% { transform: translate(-15vw, 8vh); }
}

/* 2 → recua pro fundo esquerda (posição 5) */
@keyframes ponteiro_pos2_recepcao {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-12vw, 8vh); }
  100% { transform: translate(-25vw, 12vh); }
}

/* 3 → recua pro fundo esquerda (posição 5) */
@keyframes ponteiro_pos3_recepcao {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-10vw, 6vh); }
  100% { transform: translate(-20vw, 10vh); }
}

/* 4 → pequeno ajuste, já em zona de passe */
@keyframes ponteiro_pos4_recepcao {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-4vw, 2vh); }
  100% { transform: translate(-6vw, 3vh); }
}

/* 5 → ajuste sutil, quase parado */
@keyframes ponteiro_pos5_recepcao {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(2vw, 1vh); }
  100% { transform: translate(4vw, 2vh); }
}

/* 6 → desloca levemente pra esquerda (alinha com 5) */
@keyframes ponteiro_pos6_recepcao {
  0%   { transform: translate(0, 0); }
  50%  { transform: translate(-4vw, 1vh); }
  100% { transform: translate(-8vw, 2vh); }
}


</style>
