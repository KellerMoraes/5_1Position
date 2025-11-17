<template>
    <v-container class="pa-0">
        <v-row>
            <v-col cols="8">
                <Court></Court>
            </v-col>
            <v-col cols="4">
                <v-card>
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
                    <v-card-actions><v-btn>Voltar</v-btn><v-btn>Resetar</v-btn></v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const route = useRoute()
console.log(route.params)
</script>
<style lang="scss"></style>
