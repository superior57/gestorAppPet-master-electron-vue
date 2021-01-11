<template>
     <v-card id="atendimento">
        <v-tabs>
            <v-tab>Solicitações</v-tab>
            <v-tab>Agenda</v-tab>
            <v-tab-item>
                <solicitacoes/>
            </v-tab-item>
            <v-tab-item>
            </v-tab-item>
        </v-tabs>
    </v-card> 
</template>

<script>
import solicitacoes from './Solicitacoes.vue';

export default {
    components: {
        solicitacoes
    }
}
</script>

<style scoped>
#atendimento {
    height: 100%;
}
</style>