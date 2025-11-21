<template>
    <div id="rotatable">
        <div class="content">
            <Court />
            <div class="info">
                <v-card class="info-card" width="100%" height="100%" color="transparent">
                    <v-card-title>Configuração</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item>
                                Posição Selecionada: {{ route.params.posicao }}
                            </v-list-item>
                            <v-list-item>
                                Modo Selecionada: {{ route.params.modo }}
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn>Voltar</v-btn>
                        <v-btn>Resetar</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
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
    width: 40vw;
    height: 100vh;
    background: rgb(16, 119, 255);
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
        width: 60vh;
        /* equivalente ao landscape */
        height: 100vw;
    }
}
</style>
