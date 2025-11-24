<template>
    <div id="rotatable">
        <div class="content">
            <Court v-model="resetFlag" v-model:params="model"></Court>
            <div class="info" style="position: relative;">
                <v-card flat color="transparent" height="100%">
                    <v-card-title class="text-center">Configuração</v-card-title>
                    <v-card-text>
                        <v-list-item class="text-center mb-4">
                            Posição Selecionada:
                            <v-chip variant="flat" color="primary">
                                {{ model.posicao }}
                            </v-chip>
                        </v-list-item>
                        <v-list-item class="text-center">
                            Modo Selecionado:
                            <v-chip variant="flat" color="primary">
                                {{ model.modo }}
                            </v-chip>
                        </v-list-item>
                    </v-card-text>
                    <v-card-actions class="actions" style="position: absolute; bottom: 0;">
                        <v-btn stacked @click="goBack"><v-icon>mdi-arrow-left</v-icon>Voltar</v-btn>
                        <v-btn stacked @click="resetFlag = true"><v-icon>mdi-sync</v-icon>Resetar</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const resetFlag = ref(false)
const model = defineModel()
function goBack() {
    model.value = { modo: null, posicao: null }
}
</script>

<style>
#rotatable {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #111;
}

/* Conteúdo principal que contém QUADRA + DRAWER */
.content {
    width: 100dvw;
    height: 100dvh;
    display: flex;
}

/* Drawer normal em landscape (lado direito) */
.info {
    background: rgb(56, 56, 56);
}

/* Portrait → quadra em cima, drawer embaixo */
.actions {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

@media (orientation: portrait) {
    .content {
        flex-direction: column;
        /* <- ESSA É A MUDANÇA */
    }

    .info {
        width: 100%;
        height: 45dvh;
        /* drawer na parte inferior */
    }

    .toque {
        top: 0%;
        right: 25%;
    }
}

/* Landscape → quadra na esquerda, drawer na direita */
@media (orientation: landscape) {
    .content {
        flex-direction: row;
        /* <- LADO A LADO */
    }

    .info {
        width: 45dvw;
        height: 100%;
    }

    .toque {
        top: 2%;
        right: 50%;
    }
}
</style>
