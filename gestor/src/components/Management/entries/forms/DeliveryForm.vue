<template>
  <v-card tile :disabled="loading">
    <slot-entry
      title="Cadastro de Área de Entrega"
      :close="cancell"
      :post="post"
      :showProgress="loading"
    >
      <v-card style="overflow: auto; height: 180px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="4" md="4">
                <v-select
                  dense
                  label="Cidade"
                  v-model="city"
                  :items="cities"
                  :rules="[rules.required]"
                  item-text="name"
                  return-object
                  required
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-select
                  dense
                  label="Bairro"
                  v-model="delivery.district"
                  :items="districts"
                  :rules="[rules.required]"
                  item-text="name"
                  required
                />
              </v-col>

              <v-col cols="2" md="2">
                <v-switch
                  dense
                  label="Ativo"
                  v-model="delivery.active"
                  color="color1"
                  true-value="S"
                  false-value="N"
                  hide-details
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field
                  dense
                  label="Taxa"
                  prefix="R$"
                  type="number"
                  v-model="delivery.value"
                  :rules="[rules.required, rules.numberValidation]"
                  @blur="formatNumber()"
                  required
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field dense label="Tempo" type="number" v-model="delivery.time_delivery" />
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field
                  dense
                  label="Grátis apartir de"
                  prefix="R$"
                  type="number"
                  v-model="delivery.value_free"
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
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    delivery: Object,
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
        numberValidation: value =>
          this.valideFloat(value) || "O valor precisa ser maior que 0 (zero)"
      },
      city: void 0,
      cities: [],
      districts: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters(["company"]),
    computedDateFormatted() {
      return this.$func.format.Date(this.date);
    }
  },

  watch: {
    async city(val) {
      if (!val) return;

      this.delivery.city = val.name;

      const res = await this.listDistricts({ city_id: val.id });

      this.districts = res.data;
    }
  },

  methods: {
    ...mapActions(["saveDelivery", "listCities", "listDistricts"]),
    formatNumber() {
      if (this.delivery.value)
        this.delivery.value = parseFloat(this.delivery.value).toFixed(2);
    },
    valideFloat(value) {
      if (!value) return false;
      else {
        let isString = isNaN(value);
        if (isString) return isString;
        else return parseFloat(value) > 0;
      }
    },
    updatedeliveryAddon() {
      this.$refs.form.resetValidation();
      if (this.delivery.value)
        this.delivery.value = parseFloat(this.delivery.value).toFixed(2);
      else this.delivery.value = "0.00";
      if (this.delivery.value_free)
        this.delivery.value_free = parseFloat(this.delivery.value_free).toFixed(
          2
        );
      else this.delivery.value_free = "0.00";
      if (!this.delivery.active) this.delivery.active = "S";
      this.loading = false;
    },
    cancell() {
      this.close();
    },
    post() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.saveDelivery(this.delivery).then(() => {
          this.loading = false;
          this.close(this.delivery);
        });
      }
    }
  },
  async mounted() {
    this.loading = true;
    this.updatedeliveryAddon();

    const res = await this.listCities({ uf: this.company.country });
    this.cities = res.data;

    if (this.delivery && this.delivery.city) {
      let city = this.cities.filter(city => city.name == this.delivery.city.toUpperCase())

      if (city) 
        this.city = city[0]
    }

    if (this.delivery && this.delivery.district)
      this.delivery.district = this.delivery.district.toUpperCase();
  }
};
</script>