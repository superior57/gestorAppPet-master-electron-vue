<template>
  <v-card tile :disabled="loading">
    <slot-entry title="Cadastro de Serviço" :close="cancell" :post="post" :showProgress="loading">
      <v-card style="overflow: auto; height: 320px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="9" md="9">
                <v-text-field
                  dense
                  label="Descrição"
                  v-model="service.description"
                  :rules="[rules.required, rules.min5]"
                  required
                />
              </v-col>

              <v-col cols="3" md="3">
                <v-text-field
                  dense
                  label="Valor"
                  prefix="R$"
                  type="number"
                  v-model="service.value"
                  :rules="[rules.required, rules.numberValidation]"
                  @blur="formatNumber()"
                  required
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-select
                  dense
                  label="Categoria"
                  v-model="service.category_id"
                  item-text="description"
                  item-value="id"
                  :items="categories"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-select
                  dense
                  label="Tipo de serviço"
                  v-model="service.type"
                  :items="['Estética', 'Veterinário', 'Vacina']"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="4" md="2">
                <v-switch
                  dense
                  label="Ativo"
                  v-model="service.active"
                  color="color1"
                  style="margin-top: 0"
                  true-value="S"
                  false-value="N"
                  hide-details
                />
                <v-switch
                  dense
                  label="Pacote"
                  v-model="service.package"
                  color="color1"
                  style="margin-top: 0"
                  true-value="S"
                  false-value="N"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-textarea
                  dense
                  hide-details
                  counter
                  v-model="service.observations"
                  :rules="[rules.required]"
                  label="Observações/Detalhes"
                  no-resize
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
    service: Object,
    close: Function
  },
  components: {
    slotEntry
  },
  data() {
    return {
      valid: false,
      categories: [],
      rules: {
        required: value => !!value || "Informação necessária",
        numberValidation: value =>
          this.valideFloat(value) || "O valor precisa ser maior que 0 (zero)",
        min5: value =>
          (value && value.length >= 5) ||
          "A descrição precisa ter pelo menos 5 letras"
      },
      loading: false
    };
  },
  computed: mapGetters(["company"]),
  methods: {
    ...mapActions(["getCategories", "saveService"]),
    formatNumber() {
      if (this.service.value)
        this.service.value = parseFloat(this.service.value).toFixed(2);
    },
    valideFloat(value) {
      if (!value) return false;
      else {
        let isString = isNaN(value);
        if (isString) return isString;
        else return parseFloat(value) > 0;
      }
    },
    updateServiceAddon() {
      this.$refs.form.resetValidation();
      if (this.service.value)
        this.service.value = parseFloat(this.service.value).toFixed(2);
      else this.service.value = "0.00";
      if (!this.service.active) this.service.active = "S";
      this.loading = false;
    },
    async getCategoriesList() {
      this.categories = undefined;
      this.categories = (await this.getCategories(this.company.id)).data;
      this.updateServiceAddon();
    },
    cancell() {
      this.close();
    },
    post() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        this.saveService(this.service).then(() => {
          this.loading = false;
          this.close(this.service);
        });
      }
    }
  },
  created() {
    this.getCategoriesList();
  },
  mounted() {
    this.loading = true;
    if (this.categories) this.updateServiceAddon();
  }
};
</script>