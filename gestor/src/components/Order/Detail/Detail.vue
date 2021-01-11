<template>
  <v-card v-if="order" class="v-card-main">
    <print
      v-if="printing"
    />
    <div v-else>
      <detail-header
        :user-name="order.user ? order.user.name: 'Usuário não informado'"
        :order-id="order.id"
        :created-at="order.createdAt"
        :phone="order.user ? order.user.phone: ''"
      />
      <br />
      <br />
      <detail-remove
        :branch-id="order.id_click_remove"
        :click-remove="order.click_remove == 'S'"
        :address="order.adress"
      />
      <detail-items :status="status" :items="order.items" :delivery-fee="order.delivery_fee" />
      <detail-subtotal
        :subtotal="order.subtotal"
        :discount="order.discount"
        :coupon="order.coupon"
        :formOfPayment="order.form_of_payment"
        :amount="order.amount"
        :valueChange="order.value_change"
      />
    </div>
    <v-footer v-if="printing" absolute height="70px">
      <v-spacer></v-spacer>
      <v-btn dark large color="color1" width="150px" @click="printing = false">
        <v-icon style="margin-right: 5px">fas fa-arrow-left</v-icon>VOLTAR
      </v-btn>
    </v-footer>
    <v-footer v-else absolute height="70px">
      <v-btn dark large color="error" width="150px" @click="cancell">CANCELAR</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="ma-2" width="150px" outlined large @click="printing = true">
        <v-icon style="margin-right: 5px">fas fa-print</v-icon>IMPRIMIR
      </v-btn>
      <v-btn color="color1" width="150px" dark large @click="executeOption">{{ opcao }}</v-btn>
    </v-footer>
  </v-card>
</template>

<script>
import moment from "moment";
import DetailHeader from "./Header.vue";
import DetailRemove from "./Remove.vue";
import DetailItems from "./Items.vue";
import DetailSubtotal from "./Subtotal.vue";
import print from "../Print.vue";
import Message from "@/globals/message";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      status: undefined,
      printing: false,
      opcao: ""
    };
  },

  components: {
    print,
    DetailHeader,
    DetailRemove,
    DetailItems,
    DetailSubtotal
  },

  props: {
    selectNext: Function,
    updateList: Function
  },

  watch: {
    order: function(val) {
      this.updateStatus(val.status);
    }
  },

  computed: mapGetters(["order", "company"]),

  mixins: [Message],

  methods: {
    moment,
    ...mapActions(["putOrder"]),
    ...mapActions("moura", ["createOrder"]),
    updateStatus(st) {
      switch (st) {
        case "AB":
          this.opcao = "CONFIRMAR";
          this.status = "PENDENTE";
          break;
        case "CF":
          this.opcao = "DESPACHAR";
          this.status = "EM SEPARAÇÃO";
          break;
        case "ET":
          this.opcao = "FINALIZAR";
          this.status = "EM ENTREGA";
          break;
      }
    },

    cancell() {
      this.confirm(
        `Deseja realmente cancelar o pedido "#${this.order.id}"?`
      ).then(willDelete => {
        if (willDelete) {
          this.atualizaStatus("CA").then(result => {
            if (result.error) {

              this.message("Ocorreu um erro ao cancelar o pedido.", {
                title: "Oops",
                icon: "error"
              });
            } else {
              this.message("Pedido cancelado!", {
                title: "Sucesso",
                icon: "success"
              });
            }
          });
        }
      });
    },

    executeOption() {
      let status = "";
      switch (this.opcao) {
        case "CONFIRMAR":
          status = "CF";
          break;
        case "DESPACHAR":
          status = "ET";
          break;
        case "FINALIZAR":
          status = "OK";
          break;
      }
      this.atualizaStatus(status);
    },

    atualizaStatus(status) {
      return new Promise(resolve => {
        this.putOrder({ id: this.order.id, status: status, user_id: this.order.user_id, subsidized: this.order.subsidized }).then(
          async result => {
            this.order.status = status;
            switch (status) {
              case "CF":
                this.updateList();
                this.opcao = "DESPACHAR";
                if(this.company.integrated){
                  await this.createOrder({order: this.order, server: this.company.server}).catch(error =>
                    console.error(error)
                  );
                }

                break;
              case "ET":
                this.updateList();
                this.opcao = "FINALIZAR";
                break;
              default:
                this.selectNext();
                break;
            }

            resolve(result);
          }
        );
      });
    }
  },

  mounted() {
    if (this.order !== void 0) this.updateStatus(this.order.status);
  }
};
</script>