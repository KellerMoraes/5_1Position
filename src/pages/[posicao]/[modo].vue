<template>
    <div id="rotatable">
        <div class="content">
            <Court v-model="resetFlag"></Court>
            <div class="info" style="position: relative;">
                <v-card flat color="transparent" height="100%">
                    <v-card-title class="text-center">Configuração</v-card-title>
                    <v-card-text>
                        <v-list-item class="text-center">
                            Posição Selecionada:
                            <v-chip variant="flat" color="primary">
                                {{ route.params.posicao }}
                            </v-chip>
                        </v-list-item>
                        <v-list-item class="text-center">
                            Modo Selecionada:
                            <v-chip variant="flat" color="primary">
                                {{ route.params.modo }}
                            </v-chip>
                        </v-list-item>
                    </v-card-text>
                    <v-card-actions style="position: absolute; bottom: 0;">
                        <v-btn stacked to="/"><v-icon>mdi-arrow-left</v-icon>Voltar</v-btn>
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

</script>

<style scoped>
/* VIEWPORT FIXO */
#rotatable {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #111;
}

.content {
    width: 100vw;
    height: 100vh;
    display: flex;
}

/* INFO NORMAL (LANDSCAPE REAL) */
.info {
    width: 40dvw;
    height: 100dvh;
    background: rgb(56, 56, 56);
}

/* ROTACIONAR TUDO EM PORTRAIT */
@media (orientation: portrait) {
    .content {
        transform: rotate(90deg);
        width: 100vh;
        /* virou horizontal */
        height: 100vw;
        /* virou vertical */
        transform-origin: center center;
    }

    /* Ajusta a posição para não ficar fora da tela */
    #rotatable {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info {
        width: 40dvh;
        /* equivalente ao landscape */
        height: 100dvw;
    }
}
</style>
