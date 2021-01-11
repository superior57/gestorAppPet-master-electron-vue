<template>
  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
    <template v-slot:activator="{ on }">
      <v-text-field
        :dark="dark"
        v-model="computedDateFormatted"
        :label="label"
        persistent-hint
        hide-details
        prepend-icon="event"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" no-title @input="menu = false" locale="pt-br" />
  </v-menu>
</template>

<script>
export default {
  props: {
    dark: Boolean,
    value: String,
    label: String
  },

  data() {
    return {
      menu: false
    };
  },

  computed: {
    computedDateFormatted() {
      return this.$func.format.Date(this.date);
    },

    date: {
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