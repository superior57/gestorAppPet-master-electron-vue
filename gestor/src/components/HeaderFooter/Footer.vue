<template>
    <div>
        <v-footer 
            app
            max-height="22px"
            padless
        >
            <v-flex class="text-sm-left" style="font-size: 14px; padding-left: 15px">
                <strong>&copy;{{ footerText }}</strong>
            </v-flex>
        </v-footer>
    </div>
</template>

<script>
export default {
    data() {
        return {
            footerText: "Gestor v.0.3 - F4Ti Soluções",
        }
    }
}
</script>