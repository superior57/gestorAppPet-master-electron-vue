<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="900px">
      <coupon-form :coupon="coupon" :close="close" />
    </v-dialog>
    <slot-collection
      @click:new="newCoupon"
      :information="items.length + ' cupons cadastrados'"
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
import couponForm from "./forms/CouponForm.vue";
import Message from "@/globals/message.js";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      coupon: {},
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
        { text: "Código do cupom", value: "description" },
        {
          text: "Expira em",
          value: "shelf_life",
          width: 150,
          getter: o => this.$func.format.DateHour(o.shelf_life)
        },
        {
          text: "Valor",
          value: "discount",
          align: "end",
          width: 120,
          getter: o => this.$func.format.Money(o.discount)
        },
        {
          text: "Tipo",
          value: "type",
          width: 250,
          getter: o => (o.type == "P" ? "Percentual" : "Valor")
        },
        { text: "Quantidade", value: "quantity", align: "end", width: 120 },
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
    couponForm
  },
  computed: mapGetters(["company"]),
  mixins: [Message],
  methods: {
    ...mapActions(["getCoupons", "deleteCoupon"]),
    deleteItem(item) {
      this.confirm(
        `Deseja realmente excluir o cupom "${item.description}"?`
      ).then(willDelete => {
        if (willDelete) {
          this.deleteCoupon(item.id).then(result => {
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
      });
    },
    async getItems() {
      this.loading = true;
      this.items = (await this.getCoupons(this.company.id)).data;
      this.loading = false;
    },
    newCoupon() {
      this.selected = undefined;
      this.coupon = {};
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
      this.coupon = {};
      this.dialog = false;
    },
    select(item) {
      this.selected = item;
      this.coupon = { ...item };
      this.dialog = true;
    }
  },
  created() {
    this.getItems();
  }
};
</script>