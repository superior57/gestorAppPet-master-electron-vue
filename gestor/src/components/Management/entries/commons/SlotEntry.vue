<template>
    <v-card>
        <v-toolbar flat dense color="color1" dark>
            <v-toolbar-title><strong>{{ title }}</strong></v-toolbar-title>
        </v-toolbar>
        <v-progress-linear
            v-show="showProgress"
            indeterminate
            color="color1_highlight"
        />
        <slot></slot>
        <v-footer height="70px">
            <v-btn 
                color="error" 
                width="150px" 
                dark 
                large
                @click="close()"
            >
                CANCELAR
            </v-btn>
            <v-spacer/>
            <v-btn 
                v-if="button1Click"
                width="150px" 
                outlined
                large
                @click="button1Click()"
                :disabled="!button1Enabled"
            >
                {{ button1Name }}
            </v-btn>
            <v-btn 
                style="margin-left: 5px"
                color="color1" 
                width="150px" 
                dark 
                large
                @click="post()"
            >
                SALVAR
            </v-btn>
        </v-footer>
    </v-card>
</template>

<script>
export default {
    props: {
        close: Function,
        post: Function,
        title: String,
        showProgress: Boolean,
        button1Name: String,
        button1Click: Function,
        button1Enabled: Boolean
    }
}
</script>