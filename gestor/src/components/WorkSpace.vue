<template>
  <div class="div-workspace">
    <comp-title style="margin-left: 10px" :title="title"></comp-title>
    <v-card class="v-card-main">
      <slot></slot>
    </v-card>
  </div>
</template>

<script>
import compTitle from "./HeaderFooter/Title.vue";

export default {
  props: {
    title: String
  },
  components: {
    compTitle
  }
};
</script>