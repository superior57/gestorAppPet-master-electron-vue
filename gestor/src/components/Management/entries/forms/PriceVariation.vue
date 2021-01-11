<template>
  <v-card tile>
    <slot-entry title="Variações de preço" :close="close" :post="confirm">
      <v-form ref="form" v-model="valid">
        <v-container>
          <v-row>
            <v-col cols="6" md="6">
              <v-text-field
                dense
                label="Descrição"
                v-model="variation.description"
                :rules="[rules.required]"
                required
              />
            </v-col>
            <v-col cols="4" md="4">
              <v-text-field
                dense
                label="Valor"
                prefix="R$"
                type="number"
                v-model="variation.value"
                :rules="[rules.required, rules.numberValidation]"
                @focus="tag = 1"
                @blur="tag = 0; formatNumber()"
                required
              />
            </v-col>
            <v-col cols="2" md="2">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn outlined fab small v-on="on" @click="add">
                    <v-icon>{{ button.icon }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ button.description }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-data-table
        dense
        height="155px"
        :headers="headers"
        :items="items"
        hide-default-footer
        fixed-header
        disable-pagination
        no-data-text="Nenhum registro encontrado"
      >
        <template v-slot:item="props">
          <tr>
            <td class="text-lg-right">{{ props.item.id }}</td>
            <td class="text-sm-left">{{ props.item.description }}</td>
            <td class="text-lg-right">{{ $func.format.Money(props.item.value) }}</td>
            <td>
              <v-icon small @click="select(props.item)">edit</v-icon>
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </slot-entry>
  </v-card>
</template>

<script>
import slotEntry from "../commons/SlotEntry.vue";

export default {
  props: {
    variations: Array,
    close: Function
  },
  data() {
    return {
      valid: false,
      items: [],
      tag: 0,
      selectItem: undefined,
      button: {
        icon: "fas fa-plus",
        description: "Adicionar"
      },
      variation: {},
      rules: {
        required: value => !!value || "Informação necessária",
        numberValidation: value =>
          this.valideFloat(value) || "O valor precisa ser maior que 0 (zero)"
      },
      headers: [
        { text: "#", value: "id", align: "end", width: 80 },
        { text: "Descrição", value: "description" },
        { text: "Preço", value: "value", width: 120 },
        { text: "Ações", value: "action", sortable: false }
      ]
    };
  },
  watch: {
    selectItem(val) {
      if (!val) {
        this.button.icon = "fas fa-plus";
        this.button.description = "Adicionar";
      } else {
        this.button.icon = "fas fa-check";
        this.button.description = "Alterar";
      }
    },

    variation() {
      if (this.tag != 0) {
        return;
      }
      if (this.variation.value)
        this.variation.value = parseFloat(this.variation.value).toFixed(2);
      else this.variation.value = "0.00";
    }
  },
  components: {
    slotEntry
  },
  methods: {
    deleteItem(item) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
    },
    formatNumber() {
      if (this.variation.value)
        this.variation.value = parseFloat(this.variation.value).toFixed(2);
    },
    valideFloat(value) {
      if (!value) return false;
      else {
        let isString = isNaN(value);
        if (isString) return isString;
        else return parseFloat(value) > 0;
      }
    },
    add() {
      if (this.$refs.form.validate()) {
        if (this.selectItem) {
          this.selectItem.description = this.variation.description;
          this.selectItem.value = this.variation.value;
          this.selectItem = undefined;
          this.variation = {};
        } else {
          this.items.push({
            id:
              this.items.length > 0
                ? this.items[this.items.length - 1].id + 1
                : 1,
            ...this.variation
          });
          this.variation = {};
        }
        this.$refs.form.resetValidation();
      }
    },
    confirm() {
      this.$refs.form.resetValidation();
      this.variation = {};
      this.close(this.items);
    },
    select(item) {
      this.$refs.form.resetValidation();
      this.selectItem = item;
      let vrt = {};
      Object.assign(vrt, item);
      this.variation = vrt;
    }
  },
  mounted() {
    this.items = [];
    if (this.variations) {
      Object.assign(this.items, this.variations);
    }
  }
};
</script>