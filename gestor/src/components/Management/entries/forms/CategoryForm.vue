<template>
  <v-card tile :disabled="saving">
    <slot-entry title="Cadastro de Categoria" :close="close" :post="post" :showProgress="saving">
      <v-card style="overflow: auto; height: 200px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  dense
                  v-model="category.description"
                  :rules="[rules.required, rules.min5]"
                  label="Descrição"
                  required
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-select
                  dense
                  v-model="category.type"
                  :items="['Produto', 'Serviço']"
                  :rules="[rules.required]"
                  label="Tipo de categoria"
                  required
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  label="Ativo"
                  v-model="category.active"
                  color="color1"
                  true-value="S"
                  false-value="N"
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
import { mapActions } from "vuex";

export default {
  props: {
    category: Object,
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
        min5: value =>
          (value && value.length >= 5) ||
          "A descrição precisa ter pelo menos 5 letras"
      },
      saving: false
    };
  },
  methods: {
    ...mapActions(["saveCategory"]),
    post() {
      if (this.saving) return;
      this.saving = true;
      if (this.$refs.form.validate()) {
        this.saveCategory(this.category).then(() => {
          this.saving = false;
          this.close(this.category);
        });
      }
    }
  },
  mounted() {
    this.$refs.form.resetValidation();
    if (!this.category.active) this.category.active = "S";
  }
};
</script>