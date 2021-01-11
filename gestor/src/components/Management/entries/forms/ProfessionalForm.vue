<template>
  <v-card tile :disabled="saving">
    <slot-entry title="Cadastro de Profissional" :close="close" :post="post" :showProgress="saving">
      <v-card style="overflow: auto; height: 490px">
        <v-form ref="form" v-model="valid">
          <v-container>
            <v-row dense v-if="branchs.length > 0">
              <v-col>
                <v-select
                  dense
                  label="Filial"
                  v-model="professional.branch"
                  item-text="adress"
                  item-value="id"
                  :items="branchs"
                  :rules="[rules.required]"
                  required
                />
              </v-col>
              <v-spacer />
              <v-col cols="4" md="4">
                <v-text-field
                  dense
                  v-model="professional.id_erp"
                  label="Código ERP"
                  required
                />
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="8" md="8">
                <v-text-field
                  dense
                  v-model="professional.name"
                  :rules="[rules.required, rules.min2]"
                  label="Nome"
                  required
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-switch
                  dense
                  label="Ativo"
                  v-model="professional.active"
                  color="color1"
                  hide-details
                />
              </v-col>

              <v-col cols="2" md="2">
                <v-switch
                  dense
                  label="Estética"
                  v-model="professional.esthetics"
                  true-value="S"
                  false-value="N"
                  color="color1"
                  style="margin-top: -10px"
                  hide-details
                />
              </v-col>

              <v-col cols="2" md="2">
                <v-switch
                  dense
                  label="Vacina"
                  v-model="professional.vaccine"
                  true-value="S"
                  false-value="N"
                  color="color1"
                  style="margin-top: -10px"
                  hide-details
                />
              </v-col>

              <v-col cols="2" md="2">
                <v-switch
                  dense
                  label="Consulta"
                  v-model="professional.consultations"
                  true-value="S"
                  false-value="N"
                  color="color1"
                  style="margin-top: -10px"
                  hide-details
                />
              </v-col>
            </v-row>
            <div subtitle>
              <span>Disponibilidade</span>
              <v-row dense>
                <v-col cols="6" v-for="day in week_days" :key="day.name">
                  <div group>
                    <v-row>
                      <v-col>
                        <v-checkbox
                          dense
                          :label="day.description"
                          v-model="professional.week_days[day.name].active"
                          color="color1"
                          class="week-days"
                          hide-details
                        />
                      </v-col>
                      <v-col>
                        <v-row>
                          <v-col>
                            <f4-time :disabled="!professional.week_days[day.name].active" v-model="professional.week_days[day.name].start_hour" label="Início" />
                          </v-col>
                          <v-col>
                            <f4-time :disabled="!professional.week_days[day.name].active" v-model="professional.week_days[day.name].end_hour" label="Fim" />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-container>
        </v-form>
      </v-card>
    </slot-entry>
  </v-card>
</template>

<script>
import slotEntry from "../commons/SlotEntry.vue";
import F4Time from "../../../Field/F4Time.vue";
import { mapGetters, mapActions } from "vuex";

export class Professional {
  id
  id_erp
  branch
  name
  active
  esthetics
  vaccine
  consultations
  week_days
  
  constructor ({ id, id_erp, branch, name, active, esthetics, vaccine, consultations, week_days }) {
    this.id = id || 0
    this.id_erp = id_erp || 0
    this.branch = branch
    this.esthetics = esthetics
    this.vaccine = vaccine
    this.consultations = consultations
    this.name = name
    this.active = active || true
    this.week_days = week_days || {
      sunday: { active: false, start_hour: '00:00', end_hour: '00:00' },
      monday: { active: true, start_hour: '07:00', end_hour: '19:30' }, 
      tuesday: { active: true, start_hour: '07:00', end_hour: '19:30' }, 
      wednesday: { active: true, start_hour: '07:00', end_hour: '19:30' }, 
      thursday: { active: true, start_hour: '07:00', end_hour: '19:30' }, 
      friday: { active: true, start_hour: '07:00', end_hour: '19:30' },
      saturday: { active: false, start_hour: '00:00', end_hour: '00:00' }
    }
  }
}

export default {
  props: {
    professional: {
      type: Object,
      default: new Professional({})
    },
    close: Function
  },
  components: {
    slotEntry,
    F4Time
  },
  data() {
    return {
      valid: false,
      branchs: [],
      week_days: [
        { name: 'sunday', description: 'Domingo' },
        { name: 'monday', description: 'Segunda' },
        { name: 'tuesday', description: 'Terça' },
        { name: 'wednesday', description: 'Quarta' },
        { name: 'thursday', description: 'Quinta' },
        { name: 'friday', description: 'Sexta' },
        { name: 'saturday', description: 'Sábado' }
      ],
      rules: {
        required: value => !!value || "Informação necessária",
        min2: value =>
          (value && value.length >= 2) ||
          "A descrição precisa ter pelo menos 2 letras"
      },
      saving: false
    };
  },

  computed: mapGetters(["company"]),
  methods: {
    ...mapActions(["saveProfessional", "getBranchs"]),
    post() {
      try {
        if (this.saving) return;
        this.saving = true;
        if (this.$refs.form.validate()) {
          this.saveProfessional(this.professional).then(() => {
            this.saving = false;
            this.close(this.professional);
          });
        }
      } finally {
        this.saving = false
      }
    }
  },

  async mounted() {
    this.branchs = (await this.getBranchs(this.company.id)).data;

    this.$refs.form.resetValidation();
  }
};
</script>

<style lang="sass">
[subtitle]
  margin-top: 15px
  text-align: center
  border-top-style: solid
  border-bottom-style: solid
  border-color: rgb(195, 195, 195)

  > span
    font-size: 20px
    font-weight: 500

[group]
  border-style: solid
  border-width: 2px
  border-color: rgb(195, 195, 195)
  border-radius: 2px

  .col
    margin: 5px
    padding: 3px 15px 0 0

  .week-days
    margin: 7px 0 0 15px
</style>
