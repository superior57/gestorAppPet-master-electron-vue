<template>
  <v-app id="inspire">
    <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
      <v-card class="mx-auto my-12 login" @submit.prevent="logIn">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <h2 class="text-center">Bem vindo ao Gestor</h2>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                  dense
                  v-model="email"
                  label="E-mail"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  dense
                  v-model="password"
                  :append-icon="show ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  label="Senha"
                  maxlength="6"
                  :counter="6"
                  :rules="[rules.required, rules.password]"
                  required
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-btn dark block height="50px" color="color1" type="submit">Entrar</v-btn>
              </v-col>
            </v-row>
            <v-progress-linear v-show="loading" indeterminate color="color1" />
          </v-container>
        </v-form>
      </v-card>
    </v-img>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import Message from "@/globals/message";
export default {
  name: "login",
  data() {
    return {
      valid: false,
      show: false,
      loading: false,
      email: "",
      password: "",
      rules: {
        required: value => !!value || "Informação necessária",
        password: value =>
          (value && value.length >= 4) || "Mínimo 4 caracteres",
        email: value =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "E-mail inválido"
      }
    };
  },
  computed: mapGetters(["loggedIn", "user"]),
  mixins: [Message],
  methods: {
    ...mapActions(["login", "getCompany", "configSystem"]),
    ...mapMutations(["setCompany"]),
    logIn() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      this.login({
        login: this.email,
        password: this.password
      })
        .then(() => {
          this.loading = false;
          this.$router.push({ name: "orders" });
        })
        .catch(error => {
          this.loading = false;
          this.error(error);
        });
    }
  },
  async created() {
    document.title = "Gestor de pedidos - Login";

    if (this.loggedIn) {
      this.setCompany((await this.getCompany(this.user.company_id)).data);
      if (await this.configSystem()) this.$router.push({ name: "orders" });
    }
  }
};
</script>

<style>
.login {
  margin: auto;
  padding: 40px;
  width: 500px;
}
</style>