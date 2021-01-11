<template>
  <v-app id="inspire">
    <app-header />
    <app-menu />
    <v-main>
      <router-view />
    </v-main>
    <app-footer />
  </v-app>
</template>

<script>
import appHeader from "../components/HeaderFooter/Header.vue";
import appFooter from "../components/HeaderFooter/Footer.vue";
import appMenu from "../components/Menu/SideMenu.vue";
import { themes } from "@/globals/themes.js";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      src: undefined
    };
  },

  components: {
    appHeader,
    appFooter,
    appMenu
  },

  computed: {
    ...mapGetters(["company", "user"])
  },

  mounted() {
    if (this.company.theme) {
      this.$vuetify.theme.themes.dark.color1 =
        themes[this.company.theme].dark.color1;
      this.$vuetify.theme.themes.dark.color1_highlight =
        themes[this.company.theme].dark.color1_highlight;
      this.$vuetify.theme.themes.light.color1 =
        themes[this.company.theme].light.color1;
      this.$vuetify.theme.themes.light.color1_highlight =
        themes[this.company.theme].light.color1_highlight;
    }

    this.$vuetify.theme.dark = this.user.darkMode;

    if (this.$route.path == "/") this.$router.push("orders");
  }
};
</script>