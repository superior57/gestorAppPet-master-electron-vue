<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="800px">
      <professional-form :professional="professional" :close="close" />
    </v-dialog>
    <slot-collection
      @click:new="newProfessional"
      :information="items.length + ' profissionais cadastrados'"
      instruction="Duplo clique para alterar"
      height="calc(100vh - 295px)"
      :headers="headersList"
      :items="items"
      :loading="loading"
      @dblclick:row="select"
    />
  </div>
</template>

<script>
import slotCollection from "./commons/SlotCollection.vue";
import professionalForm, { Professional } from "./forms/ProfessionalForm.vue";
import { mapActions, mapGetters } from "vuex";
import Message from "@/globals/message";

export default {
  data() {
    return {
      dialog: false,
      professional: new Professional({}),
      headersList: [
        { text: "#", value: "id", align: "end", width: 80 },
        {
          text: "Ativo",
          value: "active",
          align: "center",
          width: 80,
          chip: true,
          color: o => (o.active ? "primary" : "error"),
          getter: o => (o.active ? "Sim" : "Não")
        },
        { text: "Nome", value: "name" },
        {
          text: "Estética",
          value: "esthetics",
          align: "center",
          width: 90,
          chip: true,
          color: o => (o.esthetics == "S" ? "primary" : "error"),
          getter: o => (o.esthetics == "S" ? "Sim" : "Não")
        },
        {
          text: "Vacina",
          value: "vaccine",
          align: "center",
          width: 80,
          chip: true,
          color: o => (o.vaccine == "S" ? "primary" : "error"),
          getter: o => (o.vaccine == "S" ? "Sim" : "Não")
        },
        {
          text: "Consulta",
          value: "consultations",
          align: "center",
          width: 95,
          chip: true,
          color: o => (o.consultations == "S" ? "primary" : "error"),
          getter: o => (o.consultations == "S" ? "Sim" : "Não")
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
    professionalForm
  },
  computed: mapGetters(["company"]),
  mixins: [Message],
  methods: {
    ...mapActions(["getProfessionals", "deleteProfessional"]),
    deleteItem(item) {
      this.confirm(
        `Deseja realmente excluir o profissional "${item.name}"?`
      ).then(willDelete => {
        if (willDelete) {
          this.deleteProfessional(item.id).then(result => {
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
      this.items = (await this.getProfessionals(this.company.id)).data;
      this.loading = false;
    },
    newProfessional() {
      this.selected = undefined;
      this.professional = new Professional({});
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
      this.professional = {};
      this.dialog = false;
    },
    select(item) {
      this.selected = item;
      this.professional = new Professional({ ...item });
      this.dialog = true;
    }
  },
  created() {
    this.getItems();
  }
};
</script>