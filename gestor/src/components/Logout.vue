<template>
  <div></div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: mapActions(["logout"]),
  created() {
    this.logout().then(() => {
      this.$router.push({ name: "login" });
    });
  }
};
</script>