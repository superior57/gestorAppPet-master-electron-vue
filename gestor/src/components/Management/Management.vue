<template>
  <v-container fluid>
    <v-card class="left-card" width="250px">
      <div class="div-overflow" style="height: calc(100vh - 105px)">
        <v-navigation-drawer v-model="drawer" clipped floating permanent>
          <v-list dense nav>
            <v-subheader>
              <strong>CADASTROS</strong>
            </v-subheader>
            <v-list-item-group>
              <v-list-item v-for="item in entries" :key="item.title" :to="item.to">
                <v-list-item-icon>
                  <v-icon small v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-list dense nav>
            <v-subheader>
              <strong>CONFIGURAÇÕES</strong>
            </v-subheader>
            <v-list-item-group>
              <v-list-item v-for="item in configs" :key="item.title" :to="item.to">
                <v-list-item-icon>
                  <v-icon small v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </div>
    </v-card>
    <div>
      <work-space :title="$route.name">
        <router-view />
      </work-space>
    </div>
  </v-container>
</template>

<script>
import workSpace from "../WorkSpace.vue";

export default {
  data() {
    return {
      drawer: true,
      entries: [
        { title: "Categorias", icon: "fas fa-object-group", to: "category" },
        { title: "Produtos", icon: "fas fa-boxes", to: "product" },
        { title: "Serviços", icon: "fas fa-shower", to: "service" },
        { title: "Profissionais", icon: "fas fa-user-tie", to: "professional" },
        { title: "Cupons", icon: "fas fa-tags", to: "coupon" },
        { title: "Área de entrega", icon: "fas fa-map-marker", to: "delivery" },
        { title: "Usuários do sistema", icon: "fas fa-user-lock", to: "user" }
      ],
      configs: [
        { title: "Sistema", icon: "fas fa-cogs", show: false, to: "system" },
        {
          title: "Notificação",
          icon: "fas fa-comment-dots",
          show: false,
          to: "notification"
        }
      ]
    };
  },

  components: {
    workSpace
  },

  created() {
    if (this.$route.path == "/management/")
      this.$router.push(this.entries[0].to);
  }
};
</script>