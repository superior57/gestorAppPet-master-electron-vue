<template>
  <div style="padding: 10px 0 0 18px">
    <div style="float:left; padding: 0px 43px">Subtotal</div>
    <strong style="float: right; padding: 0 16px">{{ $func.format.Money(subtotal) }}</strong>
    <br v-if="discount > 0" />
    <div style="padding-top: 10px" v-if="discount > 0">
      <strong style="float:left; padding: 0 43px">Desconto (Cupom) '{{ coupon }}'</strong>
      <strong style="float: right; padding: 0 16px">{{ $func.format.Money(discount) }}</strong>
    </div>
    <br />
    <div style="margin-top: 10px">
      <v-icon style="float: left">fas fa-cash-register</v-icon>
      <div style="padding: 0 10px; margin-left: 33px">
        <strong>Cobrado do cliente - {{ formOfPayment }}</strong>
        <strong style="float: right; padding-right: 6px">{{ $func.format.Money(amount) }}</strong>
      </div>
    </div>
    <div style="padding: 10px 10px; margin-left: 33px" v-if="valueChange > 0">
      <strong>Troco</strong>
      <strong
        style="float: right; padding-right: 6px"
      >{{ $func.format.Money(valueChange - amount) }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    subtotal: Number,
    discount: Number,
    coupon: [Number, String],
    formOfPayment: String,
    amount: Number,
    valueChange: Number
  }
};
</script>