<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        dense
        :disabled="disabled"
        hide-details
        :dark="dark"
        v-model="time"
        :label="label"
        prepend-icon="access_time"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="menu"
      v-model="time"
      no-title
      full-width
      @click:minute="$refs.menu.save(time)"
    ></v-time-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    dark: Boolean,
    value: String,
    label: String,
    disabled: Boolean
  },

  data() {
    return {
      menu: false
    };
  },

  computed: {
    time: {
      get() {
        return this.value;
      },

      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style lang="sass" scoped>

  //  margin: 0
</style>
