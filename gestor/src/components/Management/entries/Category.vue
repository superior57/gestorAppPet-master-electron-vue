<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="400px">
      <category-form :category="category" :close="close" />
    </v-dialog>
    <slot-collection
      @click:new="newCategory"
      :information="items.length + ' categorias cadastradas'"
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
import categoryForm from "./forms/CategoryForm.vue";
import { mapGetters, mapActions } from "vuex";
import Message from "@/globals/message";

export default {
  data() {
    return {
      dialog: false,
      category: {},
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
        { text: "Tipo", value: "type", width: 350 },
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
    categoryForm
  },
  computed: mapGetters(["company"]),
  mixins: [Message],
  methods: {
    ...mapActions(["getCategories", "deleteCategory"]),
    deleteItem(item) {
      this.confirm(
        `Deseja realmente excluir a categoria "${item.description}"?`
      ).then(willDelete => {
        if (willDelete) {
          this.deleteCategory(item.id).then(result => {
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
      this.items = (await this.getCategories(this.company.id)).data;
      this.loading = false;
    },
    newCategory() {
      this.selected = undefined;
      this.category = {};
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
      this.category = {};
      this.dialog = false;
    },
    select(item) {
      this.selected = item;
      this.category = {};
      Object.assign(this.category, item);
      this.dialog = true;
    }
  },
  created() {
    this.getItems();
  }
};
</script>