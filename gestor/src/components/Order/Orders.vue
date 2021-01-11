<template>
  <v-container fluid>
    <comp-title title="Pedidos"></comp-title>
    <v-card
      class="left-card"
      style="
                padding: 10px 10px 80px 10px;
                width: 250px;
            "
    >
      <div class="div-header">
        <v-flex xs5 sm5 md5>
          <v-text-field v-model="search" append-icon="search" label="Nome" hide-details />
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs6 sm6 md6>
          <v-combobox v-model="select" :items="items"></v-combobox>
        </v-flex>
      </div>
      <div class="div-overflow" style="height: calc(100vh - 315px)">
        <div v-if="pendingOrders.length > 0 && (select == 'Todos' || select == 'Pendente')">
          <div class="title-grid">PENDENTE</div>
          <collection
            :headers="headers"
            :items="pendingOrders"
            :search="search"
            :selectOrder="selectOrder"
          />
        </div>
        <div
          v-if="inSeparationOrders.length > 0 && (select == 'Todos' || select == 'Em separação')"
        >
          <div class="title-grid">EM SEPARAÇÃO</div>
          <collection
            :headers="headers"
            :items="inSeparationOrders"
            :search="search"
            :selectOrder="selectOrder"
          />
        </div>
        <div v-if="onDeliveryOrders.length > 0 && (select == 'Todos' || select == 'Em entrega')">
          <div class="title-grid">EM ENTREGA</div>
          <collection
            :headers="headers"
            :items="onDeliveryOrders"
            :search="search"
            :selectOrder="selectOrder"
          />
        </div>
        <div
          v-if="
                        (pendingOrders.length == 0 && inSeparationOrders.length == 0 && onDeliveryOrders.length == 0) ||
                        (inSeparationOrders.length == 0 && select == 'Em preparo') ||
                        (onDeliveryOrders.length == 0 && select == 'Em entrega')
                    "
        >
          <div class="title-grid" style="font-size: 14px">NENHUM PEDIDO ENCONTRADO</div>
        </div>
      </div>
      <v-footer absolute height="70px">
        <div style="text-align: center; padding-left: 10px">
          <strong style="font-size: 11px">QUANTIDADE DE PEDIDOS LISTADOS</strong>
          <br />
          {{ countOrders() }}
        </div>
      </v-footer>
    </v-card>
    <div class="div-workspace">
      <detail :selectNext="selectNext" :updateList="updateList" />
    </div>
  </v-container>
</template>

<script>
import compTitle from "../HeaderFooter/Title.vue";
import collection from "./Collection.vue";
import detail from "./Detail/Detail.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      status: "",
      select: "Todos",
      items: ["Todos", "Pendente", "Em separação", "Em entrega"],
      search: "",
      headers: [
        {
          value: "user.name"
        }
      ]
    };
  },
  computed: mapGetters([
    "order",
    "company",
    "pendingOrders",
    "inSeparationOrders",
    "onDeliveryOrders"
  ]),
  watch: {
    select: function(val) {
      switch (val) {
        case "Todos":
          this.setOrder(
            this.pendingOrders[0] ||
              this.inSeparationOrders[0] ||
              this.onDeliveryOrders[0] ||
              void 0
          );
          break;
        case "Pendente":
          this.setOrder(this.pendingOrders[0] || void 0);
          break;
        case "Em separação":
          this.setOrder(this.inSeparationOrders[0] || void 0);
          break;
        case "Em entrega":
          this.setOrder(this.onDeliveryOrders[0] || void 0);
          break;
      }
    }
  },
  methods: {
    ...mapActions(["setOrder", "getOrders"]),
    selectOrder(order, status) {
      this.setOrder(order);
      this.status = status;
    },
    selectNext() {
      this.setOrder(
        this.pendingOrders[0] ||
          this.inSeparationOrders[0] ||
          this.onDeliveryOrders[0] ||
          void 0
      );
      this.getOrders(this.company.id);
    },
    updateList() {
      this.getOrders(this.company.id);
    },
    countOrders() {
      switch (this.select) {
        case "Todos":
          return (
            this.pendingOrders.length +
            this.inSeparationOrders.length +
            this.onDeliveryOrders.length
          );
        case "Pendente":
          return this.pendingOrders.length;
        case "Em separação":
          return this.inSeparationOrders.length;
        case "Em entrega":
          return this.onDeliveryOrders.length;
      }
    }
  },

  components: {
    compTitle,
    collection,
    detail
  }
};
</script>