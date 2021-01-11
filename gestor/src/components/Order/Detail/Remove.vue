<template>
  <component
    :is="this.clickRemove ? 'detail-pickup' : 'detail-address'"
    :address="this.clickRemove ? branchAddress : address"
  />
</template>

<script>
import DetailPickup from "./Pickup.vue";
import DetailAddress from "./Address.vue";
import { mapActions } from "vuex";
export default {
  props: {
    branchId: Number,
    clickRemove: Boolean,
    address: Object
  },

  components: {
    DetailPickup,
    DetailAddress
  },

  data() {
    return {
      component: undefined,
      branchAddress: void 0
    };
  },

  watch: {
    async branchId(val) {
      this.branchAddress = (await this.getBranchAddress(val)).data;
    }
  },

  methods: {
    ...mapActions(["getBranchAddress"])
  }
};
</script>