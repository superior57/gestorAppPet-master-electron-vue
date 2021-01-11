<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="1200px">
      <product-form :product="product" :close="close" />
    </v-dialog>
    <slot-collection
      ref="collection"
      @click:new="newProduct"
      :information="information"
      instruction="Duplo clique para alterar"
      :height="'calc(100vh - 339px)'"
      :headers="headers"
      :loading="loading"
      :get-data-from-api="getProducts"
      @dblclick:row="select"
    />
  </div>
</template>

<script>
import slotCollection from "./commons/SlotCollection.vue";
import productForm from "./forms/ProductForm.vue";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      product: {},
      headers: [
        { text: "#", value: "id", align: "end", width: 80 },
        {
          text: "Ativo",
          value: "active",
          align: "center",
          width: 80,
          chip: true,
          color: o => (o.active == "S" ? "primary" : "error"),
          getter: o => (o.active == "S" ? "Sim" : "Não")
        },
        { text: "Descrição", value: "description" },
        { text: "Tipo", value: "type", width: 250 },
        {
          text: "Preço",
          value: "value",
          align: "end",
          width: 120,
          list: true,
          getter: o => {
            let result = o;

            if (o.variation === "S" && o.variations && o.variations.length > 0) {
              result = [
                {
                  text: "A partir de",
                  style: "font-size: 0.8em; color: #A4A4A4"
                },
                this.$func.format.Money(o.variations[0].value)
              ];
            } else result = [this.$func.format.Money(o.value)];

            return result;
          }
        }
      ],
      selected: {},
      loading: false
    };
  },
  components: {
    slotCollection,
    productForm
  },

  methods: {
    ...mapActions(["getProducts"]),
    newProduct() {
      this.selected = undefined;
      this.product = {priority: 1};
      this.dialog = true;
    },
    select(item) {
      this.selected = item;
      this.product = { ...item };
      this.dialog = true;
    },
    close() {
      this.$refs.collection.refresh();

      this.delivery = {};
      this.dialog = false;
    },

    information() {
      return `${this.$refs.collection ? this.$refs.collection.count() : 0} produtos encontrados`
    }
  }
};
</script>