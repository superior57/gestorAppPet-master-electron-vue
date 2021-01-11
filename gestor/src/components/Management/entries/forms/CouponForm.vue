<template>
  <v-card tile :disabled="loading">
    <slot-entry title="Cadastro de Cupom" :close="cancell" :post="post" :showProgress="loading">
      <v-card style="overflow: auto; height: 260px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row>
              <v-col cols="3" md="3">
                <v-text-field
                  dense
                  label="Código do cupom"
                  v-model="coupon.description"
                  :rules="[rules.required]"
                  required
                />
              </v-col>

              <v-col cols="3" md="3">
                <v-text-field
                  dense
                  label="Valor de desconto"
                  prefix="R$"
                  type="number"
                  v-model="coupon.discount"
                  :rules="[rules.required, rules.numberValidation]"
                  @blur="formatNumber()"
                  required
                />
              </v-col>

              <v-col cols="3" md="3">
                <v-select
                  dense
                  label="Tipo de desconto"
                  v-model="coupon.type"
                  :items="[
                                        { text: 'Valor', value: 'V' }, 
                                        { text: 'Percentual', value: 'P' }
                                    ]"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-col cols="3" lg="3" md="3">
                <v-row dense>
                  <v-col cols="7" lg="7" md="7">
                    <v-menu
                      v-model="menuDate"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          dense
                          v-model="computedDateFormatted"
                          label="Validade"
                          persistent-hint
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        @input="menuDate = false"
                        locale="pt-br"
                      />
                    </v-menu>
                  </v-col>
                  <v-col cols="4" lg="4" md="4">
                    <v-menu
                      ref="menu"
                      v-model="menuHour"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field dense v-model="time" label="Hora" readonly v-on="on" />
                      </template>
                      <v-time-picker
                        v-if="menuHour"
                        v-model="time"
                        full-width
                        @click:minute="$refs.menu.save(time)"
                      />
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="9" md="9">
                <v-textarea
                  dense
                  hide-details
                  counter
                  v-model="coupon.rules"
                  :rules="[rules.required]"
                  label="Observações/Detalhes"
                  no-resize
                />
              </v-col>

              <v-col cols="3" md="3">
                <v-switch
                  dense
                  label="Ativo"
                  v-model="coupon.active"
                  color="color1"
                  style="margin-top: -10px"
                  true-value="S"
                  false-value="N"
                  hide-details
                />
                <v-text-field
                  dense
                  label="Compra mínima"
                  prefix="R$"
                  type="number"
                  v-model="coupon.min_purchase"
                />
                <v-text-field
                  dense
                  label="Quantidade disponível"
                  type="number"
                  v-model="coupon.quantity"
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
    coupon: Object,
    close: Function
  },
  components: {
    slotEntry
  },
  data() {
    return {
      menuDate: false,
      menuHour: false,
      date: undefined,
      time: undefined,
      valid: false,
      rules: {
        required: value => !!value || "Informação necessária",
        numberValidation: value =>
          this.valideFloat(value) || "O valor precisa ser maior que 0 (zero)"
      },
      loading: false
    };
  },
  computed: {
    computedDateFormatted() {
      return this.$func.format.Date(this.date);
    }
  },
  methods: {
    ...mapActions(["saveCoupon"]),
    formatNumber() {
      if (this.coupon.discount)
        this.coupon.discount = parseFloat(this.coupon.discount).toFixed(2);
      if (this.coupon.min_purchase)
        this.coupon.min_purchase = parseFloat(this.coupon.min_purchase).toFixed(
          2
        );
    },
    valideFloat(value) {
      if (!value) return false;
      else {
        let isString = isNaN(value);
        if (isString) return isString;
        else return parseFloat(value) > 0;
      }
    },
    updateCouponAddon() {
      this.$refs.form.resetValidation();
      if (this.coupon.discount)
        this.coupon.discount = parseFloat(this.coupon.discount).toFixed(2);
      else this.coupon.discount = "0.00";
      if (this.coupon.min_purchase)
        this.coupon.min_purchase = parseFloat(this.coupon.min_purchase).toFixed(
          2
        );
      else this.coupon.min_purchase = "0.00";
      if (!this.coupon.active) this.coupon.active = "S";
      if (this.coupon.shelf_life) {
        this.date = new Date(this.coupon.shelf_life).toISOString();
        this.time = this.$func.format.Hour(this.coupon.shelf_life);
      } else {
        this.date = new Date().toISOString();
        this.time = this.$func.format.Hour(new Date().toISOString());
      }
      this.loading = false;
    },
    cancell() {
      this.close();
    },
    post() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.coupon.shelf_life = this.$func.convert.ToDateHour(
          this.$func.format.Date(this.date) + " " + this.time
        );

        this.saveCoupon(this.coupon).then(() => {
          this.loading = false;
          this.close(this.coupon);
        });
      }
    }
  },
  mounted() {
    this.loading = true;
    this.updateCouponAddon();
  }
};
</script>