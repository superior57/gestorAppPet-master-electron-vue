<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="700px">
      <delivery-form :delivery="delivery" :close="close" />
    </v-dialog>
    <slot-collection
      @click:new="newDelivery"
      :information="items.length + ' áreas de entrega cadastradas'"
      instruction="Duplo clique para alterar"
      :height="'calc(100vh - 295px)'"
      :headers="headers"
      :items="items"
      :loading="loading"
      @dblclick:row="select"
    />
  </div>
</template>

<script>
import slotCollection from "./commons/SlotCollection.vue";
import deliveryForm from "./forms/DeliveryForm.vue";
import { mapActions, mapGetters } from "vuex";
import Message from "@/globals/message";

export default {
  data() {
    return {
      dialog: false,
      delivery: {},
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
        { text: "Cidade", value: "city", width: 250 },
        { text: "Bairro", value: "district" },
        {
          text: "Taxa",
          value: "value",
          align: "end",
          width: 100,
          getter: o => this.$func.format.Money(o.value)
        },
        { text: "Tempo", value: "time_delivery", align: "end", width: 100 },
        {
          text: "Grátis apartir de",
          value: "value_free",
          align: "end",
          width: 140,
          getter: o => this.$func.format.Money(o.value_free)
        },
        {
          text: "Excluir",
          sortable: false,
          align: "center",
          width: 30,
          buttons: [
            {
              click: o => {
                this.deleteItem(o);
              },
              icon: "delete"
            }
          ]
        }
      ],
      items: [],
      selected: {},
      loading: false
    };
  },
  components: {
    slotCollection,
    deliveryForm
  },
  computed: mapGetters(["company"]),
  mixins: [Message],
  methods: {
    ...mapActions(["getDeliveries", "deleteDelivery"]),
    deleteItem(item) {
      this.confirm(`Deseja realmente excluir á área "${item.district}"?`).then(
        willDelete => {
          if (willDelete) {
            this.deleteDelivery(item.id).then(result => {
              if (result.ok) {
                this.message(result.body.message, {
                  title: "Sucesso",
                  icon: "success"
                });
                const index = this.items.indexOf(item);
                this.items.splice(index, 1);
              } else {
                this.message(result.body.message, {
                  title: "Oops",
                  icon: "error"
                });
              }
            });
          }
        }
      );
    },
    async getItems() {
      this.loading = true;
      this.items = (await this.getDeliveries(this.company.id)).data;
      this.loading = false;
    },
    newDelivery() {
      this.selected = undefined;
      this.delivery = {};
      this.dialog = true;
    },
    close(item) {
      if (item) {
        if (this.selected) {
          Object.assign(this.selected, item);
          this.selected = {};
        } else {
          this.items.push(item);
        }
      }
      this.delivery = {};
      this.dialog = false;
    },
    select(item) {
      this.selected = item;
      this.delivery = { ...item };
      this.dialog = true;
    }
  },
  created() {
    this.getItems();
  }
};
</script>