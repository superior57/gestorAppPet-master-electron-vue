<template>
  <div class="endereco">
    <h2 class="h2-destaque">RETIRADA NA LOJA</h2>
    <p v-if="address">
      <strong>Loja:</strong>
      {{address.adress}}
      <br />
      <strong>Telefone:</strong>
      {{address.phone}}
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