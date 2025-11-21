<template>
  <v-card width="100%" height="100dvh" class="d-flex justify-start pa-7">

    <v-card ref="courtRef" class="court" color="orange" style="border-left: 2px white solid;border-top: 2px white solid;border-bottom: 2px white solid;border-right: 8px white dashed; position: relative; width: min(90vw, 90vh);
  height: min(90dvw, 90dvh);">

      <div style="width: 3px; height: 100%; background-color: white; position: absolute; left: 62%"></div>

      <!-- HITBOXES + TOKENS -->
      <v-card v-for="box in hitboxes" :key="box.id" @click="startPlay(box.id)" flat tile :width="box.W + '%'"
        :height="box.H + '%'" :location="box.L" position="absolute" color="rgb(0,0,0,0.2)"
        class="d-flex justify-center align-center">

        <!-- TOKEN ANIMÁVEL -->
      </v-card>
      <div v-for="box in initial" style="pointer-events: none;">
        <v-avatar :ref="el => tokenRefs[box.id] = el" class="token" :color="posicao == box.id ? 'white' : 'primary'"
          size="45" style="position: absolute; left: 0; top: 0;"
          :style="{ zIndex: activeStep == box.id ? 5 : '', border: posicao == box.id ? '1px black solid' : '' }">
          {{ started ? box.shortName : box.id }}
        </v-avatar>

        <div v-if="activeMessage && activeStep == box.id"
          style="z-index: 5; color: white; position: absolute; width: 40%; font-size: 14px; background-color: black; opacity: 0.9; padding: 8px;border-radius: 6px; text-align: center; "
          :style="{
            top: (box.id == 1 || box.id == 2 ? tokenPositions[box.id]?.y - 55 : tokenPositions[box.id]?.y + 55) + 'px',
            left: (tokenPositions[box.id]?.x - 45) + 'px'
          }">
          {{ activeMessage }}
        </div>
      </div>
      <Transition name="fade-overlay">
        <div v-if="overlay" class="overlay-bg" @click="nextMove">
        </div>
      </Transition>
      <div v-if="overlay" class="toque" style="position: fixed; color: white; top: 2%; right: 50%;">
        {{ toqueMsg }}</div>
    </v-card>
  </v-card>
</template>

<script setup>
import { ref } from "vue"
import { useMotion } from "@vueuse/motion"

// === armazenará ESTADOS DE MOTION por ID ===
const motionStates = ref({})
const tokenRefs = ref({})
const motions = ref({})
const overlay = ref(false)
const courtRef = ref(null)
const courtSize = ref({ w: 0, h: 0 })
const stepI = ref(0)
const posicao = ref(null)
const activeStep = ref(null)
const started = ref(false)
const activeMessage = ref(null)
const toqueMsg = ref('Toque para continuar ')
const route = useRoute()
const tokenPositions = ref({})
onMounted(async () => {

  // esperar refs preencherem
  await waitForTokenRefs()
  updateCourtSize();
  await nextTick()

  for (const id in tokenRefs.value) {
    const el = tokenRefs.value[id]
    if (!el) continue
    const data = initial.value.find(p => p.id == id)
    if (!data) continue

    const motion = useMotion(el, {
      initial: { x: XRes(data.x), y: YRes(data.y) },
    })

    tokenPositions.value[id] = { x: XRes(data.x), y: YRes(data.y) }
    motions.value[id] = motion
  }
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
  await nextTick();
})
function XRes(x) {
  return courtSize.value.w * x
}
function YRes(y) {
  return courtSize.value.h * y
}
function waitForTokenRefs() {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (Object.keys(tokenRefs.value).length > 0) {
        clearInterval(interval)
        resolve()
      }
    }, 10)
  })
}
const handleResize = () => { updateCourtSize(); reposition() }

function reposition() {
  for (const id in tokenRefs.value) {
    const el = tokenRefs.value[id]
    if (!el) continue
    const data = initial.value.find(p => p.id == id)
    if (!data) continue

    const motion = useMotion(el, {
      initial: { x: XRes(data.x), y: YRes(data.y) },
    })

    motions.value[id] = motion

  }
}
function updateCourtSize() {
  if (!courtRef.value) return;

  courtSize.value = {
    w: courtRef.value?.$el.clientWidth * 0.9,
    h: courtRef.value?.$el.clientHeight * 0.9
  };

  console.log(courtSize.value.h)
}
const papeis = [
  "P",     // posição 1
  "OP",    // posição 5
  "L",   // posição 6
  "P",     // posição 4
  "Lev",    // posição 2
  "C",     // posição 3
]
function rotacionar(arr, deslocamento) {
  const n = arr.length;
  return arr.map((_, i) => arr[(i - deslocamento + n) % n]);
}
function calcularRotacao(posicaoClicada) {
  const indexDestino = posicaoClicada - 1;
  const indexOrigem = papeis.indexOf(papelUsuarioShort);

  const deslocamento = indexDestino - indexOrigem;

  return rotacionar(papeis, deslocamento);
}
const mapPapelParaShort = {
  "Ponteiro": "P",
  "Central": "C",
  "Oposto": "OP",
  "Levantador": "Lev",
  "Líbero": "L"
};

const papelUsuarioShort = mapPapelParaShort[route.params.posicao];
function aplicarShortnames(posicaoClicada) {
  const papeisRotacionados = calcularRotacao(posicaoClicada);

  initial.value.forEach((token, i) => {
    token.shortName = papeisRotacionados[i];
  });

  // força rerender no Vue
  initial.value = [...initial.value];
}
const hitboxes = ref([
  { id: 1, W: 60, H: 32, L: "bottom left", Focus: false },
  { id: 2, W: 35, H: 32, L: "bottom right", Focus: false },
  { id: 3, W: 35, H: 32, L: "right center", Focus: false },
  { id: 4, W: 35, H: 32, L: "top right", Focus: false },
  { id: 5, W: 60, H: 32, L: "top left", Focus: false },
  { id: 6, W: 60, H: 32, L: "left center", Focus: false },
])
// x == esquerda direita
// y == cima baixo
const initial = ref([
  { id: 1, x: 0.25, y: 0.87, shortName: "P" },
  { id: 2, x: 0.85, y: 0.87, shortName: "Lev" },
  { id: 3, x: 0.85, y: 0.49, shortName: "C", focus: true },
  { id: 4, x: 0.85, y: 0.11, shortName: "P", focus: true },
  { id: 5, x: 0.25, y: 0.11, shortName: "OP", focus: true },
  { id: 6, x: 0.25, y: 0.49, shortName: "L" },
])
// x == esquerda direita
// y == cima baixo
// MOVIMENTOS
const Movimentos = {
  Recepcao: {
    4: {
      steps: [
        { id: 5, x: 0, y: 0.11, shortName: "OP", text: "O Oposto recua, pois não participa da recepção.", focus: true },
        { id: 4, x: 0.25, y: 0.11, shortName: "P", text: "Você (Ponteiro) recua para a linha de recepção no lugar do Oposto.", focus: true },
        { id: 3, x: 0.85, y: 0.52, shortName: "C", text: "O Central não pode ultrapassar você à esquerda.", focus: true },
        { id: 6, x: 0.23, y: 0.49, shortName: "L" },
        { id: 1, x: 0.27, y: 0.87, shortName: "P" },
        { id: 2, x: 0.83, y: 0.85, shortName: "Lev", text: "só levanta...." },
      ]
    },
    3: {
      steps: [
        { id: 5, x: 0, y: 0.11, shortName: "OP", text: "Recua para não participar da recepção", focus: true },
        { id: 4, x: 0.25, y: 0.11, shortName: "P", focus: true },
        { id: 3, x: 0.85, y: 0.52, shortName: "C", focus: true },
        { id: 6, x: 0.23, y: 0.49, shortName: "L" },
        { id: 1, x: 0.27, y: 0.87, shortName: "P" },
        { id: 2, x: 0.83, y: 0.85, shortName: "Lev" },
      ]
    }
  }
}
async function startPlay(posi) {
  // determina qual a posicao da recepecao foi escolhido 
  if (stepI.value == 0) {
    started.value = true
    posicao.value = posi
    aplicarShortnames(posi); // ← AQUI FAZ A MÁGICA
    toqueMsg.value = 'Toque para continuar '
    executarInformacoes(route.params.modo, posi)
    // executarMovimento(0)
  }

}
const finalizando = ref(false)
async function nextMove() {
  const steps = Movimentos[route.params.modo][posicao.value].steps;

  // 1 — esconda overlay e mensagem
  overlay.value = false;
  activeMessage.value = false;
  if (finalizando.value) {
    toqueMsg.value = 'Toque para continuar '
    stepI.value = 0
    reposition()
    overlay.value = false
    return
  }
  // 2 — delay opcional antes da animação
  await new Promise(r => setTimeout(r, 450));

  // 3 — anima 1 step
  await executarMovimento(route.params.modo, posicao.value);

  if (stepI.value >= steps.length) {
    overlay.value = true;
    toqueMsg.value = "Toque para terminar e resetar";
    finalizando.value = true;
    return;
  }

  // 5 — se não acabou, então MOSTRA a explicação do próximo step
  executarInformacoes(route.params.modo, posicao.value);
}
// TOCA NA POSICAO(COMEÇO)
//1- OVERLAY + EXPLICAÇÃO + SETA?
//2- MENSAGEM DE "TOQUE NA TELA PARA CONTINUAR"
//3- ANIMAÇÃO DO TOKEN
//1...
// === função que ANIMA ===

async function executarMovimento(modo, posicao) {
  const steps = Movimentos[modo][posicao].steps
  let step = steps[stepI.value]
  const motion = motions.value[step.id]

  await motion.apply({
    x: XRes(step.x),
    y: YRes(step.y),
    transition: { duration: 600 }
  })
  tokenPositions.value[step.id] = {
    x: XRes(step.x),
    y: YRes(step.y)
  }
  stepI.value++
}
function executarInformacoes(modo, posicao) {
  const steps = Movimentos[modo][posicao].steps
  const step = steps[stepI.value]

  overlay.value = true
  activeStep.value = step.id
  activeMessage.value = step.text

}

</script>

<style lang="scss" scoped>
.court {
  position: absolute;
  overflow: visible;

}

.token {
  position: absolute;
  will-change: transform;
}

.toque {
  animation: toqueParaContinuar 3s infinite;
}

.overlay-bg {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.6;
  top: 0;
  left: 0;
  pointer-events: auto;
}

.fade-overlay-enter-from {
  opacity: 0;
}

.fade-overlay-enter-to {
  opacity: 0.6;

  /* aqui você define o QUE você quer de verdade */
}

.fade-overlay-leave-from {
  opacity: 0.6;
}

.fade-overlay-leave-to {
  opacity: 0;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.8s ease;

}





@keyframes toqueParaContinuar {
  0% {
    opacity: 1;
  }

  10% {
    opacity: 0.9;
  }

  20% {
    opacity: 0.8;
  }

  30% {
    opacity: 0.7;
  }

  40% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.5;
  }

  60% {
    opacity: 0.6;
  }

  70% {
    opacity: 0.7;
  }

  80% {
    opacity: 0.8;
  }

  90% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }

}
</style>
