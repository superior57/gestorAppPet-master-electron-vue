<template>
    <v-card>
        <v-toolbar
            height="40px"
            style="margin-bottom: 10px"
        >
            <v-toolbar-title><strong>{{ title }}</strong></v-toolbar-title>
        </v-toolbar>
    </v-card>
</template>

<script>
export default {
    props: {
        title: String
    }
}
</script>