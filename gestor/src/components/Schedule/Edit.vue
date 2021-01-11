<template>
  <v-card tile :disabled="loading">
    <slot-entry title="Alterar Atendimento" :close="() => $emit(`edit:close`)" :post="post" :showProgress="loading">
      <v-card style="overflow: auto; height: 160px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row dense>
              <v-col cols="5">
                <f4-date v-if="date" v-model="date" label="Data" />
              </v-col>
              <v-col cols="3">
                <f4-time v-if="hour" v-model="hour" label="Hora" />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col>
                <v-select
                  dense
                  label="Profissional"
                  v-model="professional"
                  :items="professionals"
                  item-text="name"
                  return-object
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </slot-entry>
  </v-card>
</template>

<script>
import F4Date from "../Field/F4Date.vue";
import F4Time from "../Field/F4Time.vue";
import SlotEntry from '../Management/entries/commons/SlotEntry.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    schedule: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      valid: false,
      date: void 0,
      hour: void 0,
      professional: undefined,
      professional_erp: undefined,
      professionals: [],
      loading: false
    };
  },

  computed: mapGetters(["company"]),

  components: {
    SlotEntry,
    F4Date,
    F4Time
  },

  methods: {
    ...mapActions(["getProfessionals", "putSchedule"]),

    post() {
      this.schedule.date = this.date
      this.schedule.hour = this.hour
      this.schedule.professional = this.professional.name
      this.schedule.professional_id_erp = this.professional.id_erp
      this.putSchedule(this.schedule)
      this.$emit('edit:close')
    }
  },

  async mounted() {
    this.date = this.schedule.date;
    this.hour = this.schedule.hour;
  },

  async created() {
    try {
      this.loading = true
      this.professionals = (await this.getProfessionals(this.company.id)).data;
      this.professional = this.professionals.filter((prof) => prof.name === this.schedule.professional)[0]
      this.professional_erp = this.professional.id_erp
    } finally {
      this.loading = false
    }
  }
};
</script>