<template>
  <div>
    <div>
      <strong style="margin-right: 10px">{{ userName }}</strong>
      Pedido #{{ orderId }}
      <strong
        style="margin-left: 10px"
      >Feito {{ $func.format.Date(createdAt) }} às {{ $func.format.Hour(createdAt) }}</strong>
    </div>
    <div class="div-destaque">
      <v-icon small>fas fa-clock</v-icon>Entrega prevista:
      <strong>{{ $func.format.Hour(deliveryTime)}}</strong>
    </div>
    <div class="div-destaque telefone">
      <v-icon small>fas fa-phone</v-icon>
      {{ phone }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userName: String,
    orderId: Number,
    createdAt: String,
    phone: String
  },
  computed: {
    deliveryTime() {
      let myDate = new Date(this.createdAt);
      return new Date(
        myDate.setMinutes(myDate.getMinutes() + 50)
      ).toISOString();
    }
  }
};
</script>