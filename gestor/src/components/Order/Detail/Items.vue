<template>
  <div>
    <v-toolbar height="40px" color="color1" style="color: white">
      <strong>{{ status }}</strong>
    </v-toolbar>
    <v-data-table
      height="100px"
      dense
      :headers="headers"
      :items="items"
      hide-default-footer
      item-key="id"
      fixed-header
      disable-pagination
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-sm-left">{{ item.description }}</td>
          <td class="text-lg-right">{{ item.quantity }}</td>
          <td class="text-lg-right">{{ $func.format.Money(item.price) }}</td>
          <td class="text-lg-right">{{ $func.format.Money(item.total) }}</td>
        </tr>
      </template>
    </v-data-table>
    <v-footer color="color1" style="color: white">
      <v-icon style="float: left" dark>fas fa-shipping-fast</v-icon>
      <strong style="margin-left: 15px">Taxa de entrega</strong>
      <v-spacer></v-spacer>
      <strong>{{ $func.format.Money(deliveryFee) }}</strong>
    </v-footer>
  </div>
</template>

<script>
export default {
  props: {
    status: String,
    items: Array,
    deliveryFee: Number
  },

  data() {
    return {
      headers: [
        { text: "Item", value: "description" },
        { text: "Qtde", value: "quantity", width: 80 },
        { text: "Valor Unit.", value: "price", width: 130 },
        { text: "Subtotal", value: "total", width: 130 }
      ]
    };
  }
};
</script>