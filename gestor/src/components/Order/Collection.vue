<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    item-key="id"
    hide-default-header
    hide-default-footer
    disable-pagination
  >
    <template v-slot:item="{ item, status }">
      <tr
        :class="order && item.id === order.id ? 'select_highlight': ''"
        @click="selectOrder(item, status)"
      >
        <td class="text-xs-right">
          <strong v-if="item.user">{{ item.user.name }}</strong>
          <strong v-else>Usuário não informado</strong>
          <br />
          #{{ item.id }}
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    headers: Array,
    items: Array,
    search: String,
    selectOrder: Function,
    status: String
  },

  computed: mapGetters(["order"])
};
</script>