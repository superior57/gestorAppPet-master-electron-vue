<template>
  <div>
    <v-app-bar height="60px" app clipped-left>
      <v-app-bar-nav-icon @click.stop="config.miniMenu = !config.miniMenu"></v-app-bar-nav-icon>
      <v-avatar @click.stop="config.miniMenu = !config.miniMenu" size="47px">
        <img :src="config.logoIcon" />
      </v-avatar>
      <v-toolbar-title>
        <strong style="padding-left: 15px;">{{ company.name }}</strong>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div style="margin-top: 25px">
        <v-switch
          dense
          label="Modo escuro"
          v-model="user.darkMode"
          @click.stop="changeDarkMode()"
          color="color1"
        />
        <v-switch
          dense
          :label="company && company.open ? 'Aberto':'Fechado'"
          v-model="company.open"
          @click.stop="changeCompanyState()"
          color="color1"
          style="margin-top: -25px"
        />
      </div>
    </v-app-bar>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  computed: mapGetters(["company", "config", "user"]),
  methods: {
    ...mapMutations(["setOpenCompany"]),
    ...mapActions(["updateSessionUser", "updateSessionCompany"]),
    async changeDarkMode() {
      this.$vuetify.theme.dark = !this.user.darkMode;
      this.user.darkMode = !this.user.darkMode;
      await this.updateSessionUser();
    },
    async changeCompanyState() {
      this.setOpenCompany(!this.company.open);
      await this.updateSessionCompany();
    }
  }
};
</script>