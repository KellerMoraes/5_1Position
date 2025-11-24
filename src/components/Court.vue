<template>
  <v-card width="100%" height="100dvh" class="d-flex justify-start pa-7">
    <v-card ref="courtRef" class="court" color="orange" style="
        border: 2px solid white;
        border-right: 8px dashed white;
        position: relative;
        width: min(90vw, 90vh);
        height: min(90dvw, 90dvh);
      ">
      <div style="width: 3px; height: 100%; background:white; position:absolute; left:62%"></div>

      <!-- HITBOXES -->
      <v-card v-for="box in hitboxes" :key="box.id" flat tile position="absolute" color="rgba(0,0,0,0.2)"
        class="d-flex justify-center align-center" :width="box.W + '%'" :height="box.H + '%'" :location="box.L"
        @click="startPlay(box.id)" />

      <!-- TOKENS -->
      <div v-for="box in initial" :key="box.id" style="pointer-events:none;">
        <v-avatar :ref="el => (tokenRefs[box.id] = el)" class="token" :color="posicao === box.id ? 'white' : 'primary'"
          size="45" style="position:absolute; left:0; top:0;" :style="{
            zIndex: activeStep === box.id ? 5 : '',
            border: posicao === box.id ? '1px solid black' : ''
          }">
          {{ started ? box.shortName : box.id }}
        </v-avatar>

        <!-- BALÃO DE TEXTO -->
        <div v-if="activeMessage && activeStep === box.id" class="msg" :style="{
          top: (box.id <= 2 ? tokenPositions[box.id]?.y - 55 : tokenPositions[box.id]?.y + 55) + 'px',
          left: (tokenPositions[box.id]?.x - 45) + 'px'
        }">
          {{ activeMessage }}
        </div>
      </div>

      <!-- OVERLAY -->
      <Transition name="fade-overlay">
        <div v-if="overlay" class="overlay-bg" @click="nextMove" />
      </Transition>

      <div v-if="overlay" class="toque">
        {{ toqueMsg }}
      </div>

      <!-- SETA -->
      <div v-if="arrowData" class="arrow" :style="{
        top: arrowData.y + 'px',
        left: arrowData.x + 'px',
        transform: `translate(-50%, -50%) rotate(${arrowData.angle - 90}deg)`
      }">
        <span></span><span></span><span></span>
      </div>
    </v-card>
  </v-card>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { useMotion } from "@vueuse/motion";
import { useRoute } from "vue-router";

/* =========================
   REFS E ESTADOS
========================= */
const tokenRefs = ref({});
const motions = ref({});
const tokenPositions = ref({});
const motionStates = ref({});
const overlay = ref(false);
const started = ref(false);
const finalizando = ref(false);
const activeMessage = ref(null);
const activeStep = ref(null);
const toqueMsg = ref("Toque para continuar ");
const stepI = ref(0);
const posicao = ref(null);
const arrowData = ref(null);
const seta = ref(null);
const isPortrait = ref(false);
const courtRef = ref(null);
const courtSize = ref({ w: 0, h: 0 });

const route = useRoute();
const model = defineModel();
const params = defineModel('params')
console.log(params.value)
/* =========================
   WATCHERS
========================= */
watch(model, v => v && finish());

/* =========================
   HELPERS DE RESOLUÇÃO
========================= */
const XRes = x => courtSize.value.w * x;
const YRes = y => courtSize.value.h * y;

/* =========================
   ESPERA TOKEN REFS
========================= */
const waitForTokenRefs = () =>
  new Promise(resolve => {
    const timer = setInterval(() => {
      if (Object.keys(tokenRefs.value).length) {
        clearInterval(timer);
        resolve();
      }
    }, 10);
  });

/* =========================
   LOADING INICIAL
========================= */
onMounted(async () => {
  await load();
  window.addEventListener("resize", updateCourtSize);
  window.addEventListener("orientationchange", updateCourtSize);
  window.addEventListener("orientationchange", positionTokens);
  // checkOrientation()
  window.addEventListener('resize', () => {
    nextTick(() => {
      updateCourtSize();
      positionTokens();
    });
  });
});
async function load() {
  await waitForTokenRefs();
  updateCourtSize();
  await nextTick();
  positionTokens()
}
function mostrarSetaRobusta(fromId, step) {
  const elFrom = tokenRefs.value[fromId];
  const avatarRadius = 22.5; // meio do avatar (px) — mantenha ou calcule dinamicamente se variar size

  const courtR = courtRect();
  if (!courtR) return;

  // rect do elemento atual (pega posição real na tela, inclusive se estiver animando)
  const cx1 = tokenPositions.value[fromId].x + avatarRadius;
  const cy1 = tokenPositions.value[fromId].y + avatarRadius;

  // Centro destino (calculado a partir de step.x/step.y -> usando XRes/YRes)
  const destX = XRes(step.x);
  const destY = YRes(step.y);
  const cx2 = XRes(step.x) + avatarRadius;
  const cy2 = YRes(step.y) + avatarRadius;

  // dx/dy no sistema de pixels (y cresce para baixo)
  const dx = cx2 - cx1;
  const dy = cy2 - cy1;

  // ângulo em graus usando atan2(dy, dx) — funciona no sistema de coordenadas de tela
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;

  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  // ponto de partida deslocado pelo raio (para não sair do centro do avatar)
  const startX = cx1 + ux * avatarRadius;
  const startY = cy1 + uy * avatarRadius;

  // comprimento da seta (metade da distância, por exemplo)
  const len = dist * 0.5;
  const midX = startX + ux * (len / 2);
  const midY = startY + uy * (len / 2);

  // Atribui ao reactive usado pelo template (coordenadas em px relativas ao court)
  console.log(ang - 90)
  arrowData.value = { x: midX, y: midY, angle: ang };
}
function elRect(el) {
  if (!el) return null;
  // tokenRefs guarda o que você setou com ref => (tokenRefs[box.id] = el)
  // Pode ser um componente Vuetify (com $el) ou um HTMLElement direto
  const node = el.$el ?? el;
  if (!node || !node.getBoundingClientRect) return null;
  return node.getBoundingClientRect();
}

function courtRect() {
  if (!courtRef.value) return null;
  const node = courtRef.value.$el ?? courtRef.value;
  return node.getBoundingClientRect();
}
function positionTokens() {
  for (const id in tokenRefs.value) {
    const el = tokenRefs.value[id];
    const data = initial.value.find(p => p.id == id);
    if (!el || !data) continue;

    const motion = useMotion(el, {
      initial: { x: XRes(data.x), y: YRes(data.y) }
    });

    motions.value[id] = motion;
    tokenPositions.value[id] = { x: XRes(data.x), y: YRes(data.y) };
  }
}


/* =========================
   FINALIZAR E RECARREGAR
========================= */
function finish() {
  toqueMsg.value = "Toque para continuar ";
  stepI.value = 0;
  started.value = false;
  activeMessage.value = null;
  overlay.value = false;
  posicao.value = null;
  finalizando.value = false;
  model.value = false;

  reposition();
  load();
}

/* =========================
   REPOSICIONAMENTO
========================= */
function updateCourtSize() {
  if (!courtRef.value) return;

  courtSize.value = {
    w: courtRef.value.$el.clientWidth * 0.9,
    h: courtRef.value.$el.clientHeight * 0.9
  };
}

function reposition() {
  for (const id in tokenRefs.value) {
    const el = tokenRefs.value[id];
    const data = initial.value.find(p => p.id == id);
    if (!el || !data) continue;

    motions.value[id] = useMotion(el, {
      initial: { x: XRes(data.x), y: YRes(data.y) }
    });
  }
}

/* =========================
   LÓGICA DE PAPÉIS
========================= */
const papeis = ["P", "OP", "L", "P", "Lev", "C"];
const mapPapelParaShort = {
  Ponteiro: "P",
  Central: "C",
  Oposto: "OP",
  Levantador: "Lev",
  Líbero: "L"
};
const papelUsuarioShort = mapPapelParaShort[params.value.posicao];

const rotacionar = (arr, d) =>
  arr.map((_, i) => arr[(i - d + arr.length) % arr.length]);

function calcularRotacao(posicaoClicada) {
  const destino = posicaoClicada - 1;
  const origem = papeis.indexOf(papelUsuarioShort);
  return rotacionar(papeis, destino - origem);
}

function aplicarShortnames(posicaoClicada) {
  const nomes = calcularRotacao(posicaoClicada);
  initial.value.forEach((t, i) => {
    t.shortName = nomes[i];
  });
}

/* =========================
   SETA
========================= */
function mostrarSeta(pAtual, pNext) {
  const r = 22.5;

  const cx1 = pAtual.x + r;
  const cy1 = pAtual.y + r;
  const cx2 = pNext.x + r;
  const cy2 = pNext.y + r;

  const dx = cx2 - cx1;
  const dy = -(cy2 - cy1);

  let ang = (Math.atan2(dy, dx) * 180) / Math.PI;

  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const startX = cx1 + ux * r;
  const startY = cy1 + uy * r;

  const len = dist * 0.5;
  const midX = startX + ux * (len / 2);
  const midY = startY + uy * (len / 2);

  // Compensa a rotação do container
  const containerRot = window.innerHeight > window.innerWidth ? 90 : 0;
  arrowData.value = { x: midX, y: midY, angle: ang + containerRot };
}

/* =========================
   MOVIMENTOS
========================= */
async function executarMovimento(modo, posicao) {
  const step = Movimentos[modo][posicao].steps[stepI.value];
  const motion = motions.value[step.id];

  await motion.apply({
    x: XRes(step.x),
    y: YRes(step.y),
    transition: { duration: 600 }
  });

  tokenPositions.value[step.id] = {
    x: XRes(step.x),
    y: YRes(step.y)
  };

  stepI.value++;
}

function executarInformacoes(modo, posicao) {
  const step = Movimentos[modo][posicao].steps[stepI.value];

  // 👇 PEGA O PAPEL REAL DO JOGADOR NA ROTAÇÃO
  const jogadorReal = initial.value.find(j => j.id === step.id);

  // 👇 MOSTRA SETA NORMAL
  mostrarSetaRobusta(step.id, step);

  overlay.value = true;
  activeStep.value = step.id;

  // 👇 AQUI ESTAVA O ERRO:
  // activeMessage.value = step.text;  (ISTO IGNORA A ROTAÇÃO)
  // ENTÃO TEMOS QUE SUBSTITUIR O SHORTNAME USADO NO PLAYBOOK
  // PELO SHORTNAME REAL APÓS A ROTAÇÃO:

  if (step.text) {
    activeMessage.value = step.text
      .replace(/\bOP\b/g, jogadorReal.shortName)
      .replace(/\bP\b/g, jogadorReal.shortName)
      .replace(/\bC\b/g, jogadorReal.shortName)
      .replace(/\bLev\b/g, jogadorReal.shortName)
      .replace(/\bL\b/g, jogadorReal.shortName);
  } else {
    activeMessage.value = null;
  }
}
/* =========================
   CLICK INICIAL
========================= */
async function startPlay(posi) {
  if (stepI.value !== 0) return;

  posicao.value = posi;

  aplicarShortnames(posi); // agora troca os nomes corretos

  // Resetar tudo para posição inicial ANTES de começar
  positionTokens();

  await nextTick();

  started.value = true;
  finalizando.value = false;

  toqueMsg.value = "Toque para continuar ";

  // Mostrar informações do primeiro passo, mas não mover ainda
  executarInformacoes(params.value.modo, posi);
}

/* =========================
   NEXT STEP
========================= */
async function nextMove() {
  const steps = Movimentos[params.value.modo][posicao.value].steps;

  if (finalizando.value) {
    finish();
    return;
  }

  overlay.value = false;
  activeMessage.value = null;
  arrowData.value = null;

  await new Promise(r => setTimeout(r, 450));
  await executarMovimento(params.value.modo, posicao.value);

  if (stepI.value >= steps.length) {
    toqueMsg.value = "Toque para terminar e resetar";
    overlay.value = true;
    finalizando.value = true;
    return;
  }

  executarInformacoes(params.value.modo, posicao.value);
}

/* =========================
   HITBOXES / INITIAL / MOVIMENTOS
   (sem mudanças)
========================= */
const hitboxes = ref([
  { id: 1, W: 60, H: 32, L: "bottom left" },
  { id: 2, W: 35, H: 32, L: "bottom right" },
  { id: 3, W: 35, H: 32, L: "right center" },
  { id: 4, W: 35, H: 32, L: "top right" },
  { id: 5, W: 60, H: 32, L: "top left" },
  { id: 6, W: 60, H: 32, L: "left center" }
]);

const initial = ref([
  { id: 1, x: 0.25, y: 0.87, shortName: "P" },
  { id: 2, x: 0.85, y: 0.87, shortName: "Lev" },
  { id: 3, x: 0.85, y: 0.49, shortName: "C" },
  { id: 4, x: 0.85, y: 0.11, shortName: "L" },
  { id: 5, x: 0.25, y: 0.11, shortName: "OP" },
  { id: 6, x: 0.25, y: 0.49, shortName: "P" }
]);
// X = 0 -- Esquerda
// X = 100 -- Direita

// Y = 0 -- Cima
// Y = 100 -- Baixo
const Movimentos = {
  Recepcao: {
    2: {
      steps: [
        { id: 1, x: 0.05, y: 0.87, shortName: "Lev", text: "só levanta...." },
        { id: 5, x: 0, y: 0.11, shortName: "OP", text: "O Oposto recua, pois não participa da recepção." },
        { id: 3, x: 0.85, y: 0.52, shortName: "C", text: "O Central não pode ultrapassar você à esquerda." },
        { id: 4, x: 0.25, y: 0.87, shortName: "P", text: "Você (Ponteiro) recua para a linha de recepção." },
        { id: 6, x: 0.23, y: 0.49, shortName: "L" },
        { id: 1, x: 0.35, y: 0.87, shortName: "P" },
      ]
    },
    4: {
      steps: [
        { id: 5, x: 0, y: 0.11, shortName: "OP", text: "O Oposto recua, pois não participa da recepção." },
        { id: 4, x: 0.25, y: 0.11, shortName: "P", text: "Você (Ponteiro) recua para a linha de recepção." },
        { id: 3, x: 0.85, y: 0.52, shortName: "C", text: "O Central não pode ultrapassar você à esquerda." },
        { id: 6, x: 0.23, y: 0.49, shortName: "L" },
        { id: 1, x: 0.35, y: 0.87, shortName: "P" },
        { id: 2, x: 0.83, y: 0.85, shortName: "Lev", text: "só levanta...." }
      ]
    }
  }
};
</script>

<style scoped lang="scss">
.court {
  position: absolute;
  overflow: visible;
}

.token {
  position: absolute;
  will-change: transform;
}

.msg {
  z-index: 5;
  position: absolute;
  width: 40%;
  font-size: 14px;
  background: black;
  opacity: 0.9;
  padding: 8px;
  border-radius: 6px;
  color: white;
  text-align: center;
}

.overlay-bg {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  opacity: 0.6;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}

.fade-overlay-enter-to,
.fade-overlay-leave-from {
  opacity: 0.6;
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 0.8s;
}

.toque {
  animation: toqueParaContinuar 3s infinite;
  position: fixed;
  color: white;
  text-align: center;
}

.arrow {
  position: absolute;
  width: 1px;
  height: 1px;
  pointer-events: none;
  transform-origin: center;
}

.arrow span {
  display: block;
  width: 0.8em;
  height: 0.8em;
  border-bottom: 5px solid white;
  border-right: 5px solid white;
  rotate: 45deg;
  margin: -10px;
  animation: animate 2s infinite;
}

.arrow span:nth-child(2) {
  animation-delay: -0.2s;
}

.arrow span:nth-child(3) {
  animation-delay: -0.4s;
}

@keyframes animate {
  0% {
    opacity: 0;
    transform: translate(-20px, -20px);
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(20px, 20px);
  }
}

@keyframes toqueParaContinuar {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>
