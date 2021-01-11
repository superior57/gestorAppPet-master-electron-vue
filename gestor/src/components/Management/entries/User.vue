<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="500px">
      <user-form :user="user" :close="close" />
    </v-dialog>
    <slot-collection
      @click:new="newUser"
      :information="items.length + ' usuários cadastrados'"
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
import userForm from "./forms/UserForm.vue";
import Message from "@/globals/message";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      user: {},
      headers: [
        { text: "#", value: "id", align: "end", width: 80 },
        { text: "Nome", value: "name", align: "start" },
        { text: "E-mail", value: "login", width: 250 },
        {
          text: "Perfil",
          value: "profile",
          width: 250,
          getter: o =>
            o.profile == 1
              ? "Administrador"
              : o.profile == 2
              ? "Gestor"
              : "Atendente"
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
    userForm
  },
  computed: mapGetters(["company"]),
  mixins: [Message],
  methods: {
    ...mapActions(["getUsers", "deleteUser"]),
    deleteItem(item) {
      this.confirm(`Deseja realmente excluir o usuário "${item.name}"?`).then(
        willDelete => {
          if (willDelete) {
            this.deleteUser(item.id).then(result => {
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
      this.items = (await this.getUsers(this.company.id)).data;
      this.loading = false;
    },
    newUser() {
      this.selected = undefined;
      this.user = {};
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
      this.user = {};
      this.dialog = false;
    },
    select(item) {
      this.selected = item;
      this.user = { ...item };
      this.dialog = true;
    }
  },
  created() {
    this.getItems();
  }
};
</script>