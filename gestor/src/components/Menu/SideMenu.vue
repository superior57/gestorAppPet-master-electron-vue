<template>
  <v-navigation-drawer v-model="drawer" :mini-variant="config.miniMenu" app clipped permanent>
    <v-list dense rounded>
      <div class="buttons">
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" :value="item.value">
          <v-list-item-icon>
            <v-tooltip right :disabled="!config.miniMenu">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>

      <div class="button-config">
        <v-list-item v-for="item in manager" :key="item.title" :to="item.to" :value="item.value">
          <v-list-item-icon>
            <v-tooltip right :disabled="!config.miniMenu">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      drawer: true,
      manager: [
        {
          title: "Gestão",
          icon: "fas fa-tools",
          to: "/management/",
          value: false
        },
        {
          title: "Sair",
          icon: "fas fa-sign-out-alt",
          to: "/logout",
          value: false
        }
      ],
      items: [
        {
          title: "Pedidos",
          icon: "fas fa-tasks",
          to: "/orders",
          value: false
        },
        {
          title: "Atendimentos",
          icon: "fas fa-calendar-alt",
          to: "/schedules",
          value: false
        },
        // {
        // title: "Vacinas",
        // icon: "fas fa-syringe",
        // to: "/vaccines",
        // value: false
        // },
        {
          title: "Relatórios",
          icon: "fas fa-chart-area",
          to: "/reports/",
          value: false
        }
      ]
    };
  },

  computed: mapGetters(["config"])
};
</script>

<style scoped>
.buttons {
  position: absolute;
  top: 5px;
  right: 0;
  left: 0;
}

.button-config {
  position: absolute;
  bottom: 12px;
  right: 0;
  left: 0;
}
</style>