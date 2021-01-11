<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="700px">
      <service-form :service="service" :close="close" />
    </v-dialog>
    <slot-collection
      @click:new="newService"
      :information="items.length + ' serviços cadastrados'"
      instruction="Duplo clique para alterar"
      height="calc(100vh - 295px)"
      :headers="headers"
      :items="items"
      :loading="loading"
      @dblclick:row="select"
    />
  </div>
</template>

<script>
import slotCollection from "./commons/SlotCollection.vue";
import serviceForm from "./forms/ServiceForm.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      service: {},
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
        { text: "Tipo", value: "type", width: 350 }
      ],
      items: [],
      selected: {},
      loading: false
    };
  },
  components: {
    slotCollection,
    serviceForm
  },
  computed: mapGetters(["company"]),
  methods: {
    ...mapActions(["getServices"]),
    async getItems() {
      this.loading = true;
      this.items = (await this.getServices(this.company.id)).data;
      this.loading = false;
    },
    newService() {
      this.selected = undefined;
      this.service = {};
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
      this.service = {};
      this.dialog = false;
    },
    select(item) {
      this.selected = item;
      this.service = { ...item };
      this.dialog = true;
    }
  },
  created() {
    this.getItems();
  }
};
</script>