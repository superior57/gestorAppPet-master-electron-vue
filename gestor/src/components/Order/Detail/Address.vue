<template>
  <div class="endereco" v-if="address">
    <strong>ENDEREÇO</strong>
    <p>
      {{address.adress}}, {{address.number}} - {{address.city}} - CEP {{address.postalCode}}
      <br />
      {{address.complement}}, {{address.reference}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    address: Object
  }
};
</script>