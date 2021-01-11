<template>
  <v-card tile :disabled="loading">
    <slot-entry title="Cadastro de Usuário" :close="cancell" :post="post" :showProgress="loading">
      <v-card style="overflow: auto; height: 260px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  dense
                  label="Nome"
                  v-model="user.name"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  dense
                  label="E-mail"
                  v-model="user.login"
                  :rules="[rules.required, rules.email]"
                  required
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field
                  dense
                  label="Senha"
                  type="password"
                  v-model="user.password"
                  :rules="[rules.required, rules.password]"
                  :counter="6"
                  maxlength="6"
                  required
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-select
                  dense
                  label="Perfil"
                  v-model="user.profile"
                  item-value="value"
                  item-text="name"
                  :items="[
                    { name: 'Administrador', value: 1 }, 
                    { name: 'Gestor', value: 2 }, 
                    { name: 'Atendente', value: 3 }
                  ]"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </slot-entry>
  </v-card>
</template>

<script>
import slotEntry from "../commons/SlotEntry.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    user: Object,
    close: Function
  },
  components: {
    slotEntry
  },
  data() {
    return {
      valid: false,
      rules: {
        required: value => !!value || "Informação necessária",
        password: value =>
          (value && value.length >= 4) || "Mínimo 4 caracteres",
        email: value =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "E-mail inválido"
      },
      loading: false
    };
  },
  computed: mapGetters(["company"]),
  methods: {
    ...mapActions(["saveUser"]),
    updateuserAddon() {
      this.$refs.form.resetValidation();
      this.loading = false;
    },
    cancell() {
      this.close();
    },
    post() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        this.saveUser(this.user).then(() => {
          this.loading = false;
          this.close(this.user);
        });
      }
    }
  },
  mounted() {
    this.loading = true;
    this.updateuserAddon();
  }
};
</script>