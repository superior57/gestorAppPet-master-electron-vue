<template>
  <v-container fluid>
    <v-card class="left-card" width="250px">
      <div class="div-overflow" style="height: calc(100vh - 105px)">
        <v-navigation-drawer v-model="drawer" clipped floating permanent>
          <v-list dense nav>
            <v-subheader>
              <strong>RELATÓRIOS</strong>
            </v-subheader>
            <v-list-item-group>
              <v-list-item v-for="item in reports" :key="item.title" :to="item.to">
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
import WorkSpace from "../WorkSpace.vue";
export default {
  data() {
    return {
      drawer: true,
      reports: [
        { title: "Clientes", icon: "fas fa-users", to: "clients" },
        { title: "Vendas", icon: "fas fa-shopping-cart", to: "orders" },
        { title: "Agendamentos", icon: "fas fa-calendar-alt", to: "schedules" }
      ]
    };
  },

  components: {
    WorkSpace
  },

  created() {
    if (this.$route.path == "/reports/") this.$router.push(this.reports[0].to);
  }
};
</script>
