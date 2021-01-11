<template>
  <div>
    <v-container>
      <v-row style="margin-top: 20px">
        <v-col class="col-md-2" cols="12" lg="6" md="12">
          <v-row dense>
            <v-col v-for="(theme, desc) in themes" :key="desc" class="col-md-2" cols="12" md="6">
              <v-switch
                dense
                :style="'margin-top:'+ margin_top +'px'"
                :input-value="color"
                :label="theme.name"
                :value="desc"
                :loading="color == desc ? false: true"
                :color="user.darkMode ? theme.dark.color1: theme.light.color1"
                @click.stop="changeCompanyTheme(desc)"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" md="12">
          <v-card
            :light="user.darkMode"
            :dark="!user.darkMode"
            width="350px"
            style="padding: 5px; margin-top: -30px"
          >
            <v-card :light="!user.darkMode" :dark="user.darkMode">
              <v-toolbar dense color="color1" height="35px">
                <span style="color: white">
                  <strong>Titulo</strong>
                </span>
              </v-toolbar>
              <v-progress-linear indeterminate color="color1_highlight"></v-progress-linear>
              <div style="height: 100px">
                <v-container>
                  <v-row>
                    <v-col cols="6" md="6">
                      <v-text-field
                        dense
                        readonly
                        label="Descrição"
                        value="Pre-visualização"
                        height="15px"
                      />
                    </v-col>
                    <v-col cols="2" md="2">
                      <v-switch
                        dense
                        readonly
                        label="Ativo"
                        v-model="isActive"
                        color="color1"
                        style="margin-top: -5px"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </div>
              <v-footer height="35px">
                <v-btn dark height="20px" color="error" width="50px" style="font-size: 8px">Cancelar</v-btn>
                <v-spacer />
                <v-btn dark height="20px" color="color1" width="50px" style="font-size: 8px">Salvar</v-btn>
              </v-footer>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { themes } from "../../globals/themes.js";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      themes,
      isActive: true,
      margin_top: -36,
      collumn1: {},
      collumn2: {}
    };
  },
  computed: {
    ...mapGetters(["company", "user"]),
    color: function() {
      return this.company.theme;
    }
  },
  methods: {
    ...mapActions(["updateSessionCompany"]),
    async changeCompanyTheme(val) {
      if (this.company.theme == val) {
        if (val == "cyan") return;
        val = "cyan";
      }
      this.company.theme = val;
      this.$vuetify.theme.themes.dark.color1 = themes[val].dark.color1;
      this.$vuetify.theme.themes.dark.color1_highlight =
        themes[val].dark.color1_highlight;
      this.$vuetify.theme.themes.light.color1 = themes[val].light.color1;
      this.$vuetify.theme.themes.light.color1_highlight =
        themes[val].light.color1_highlight;
      await this.updateSessionCompany();
    }
  }
};
</script>