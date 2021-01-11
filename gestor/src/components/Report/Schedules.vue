<template>
  <report
    :items="items"
    :search="search"
    :content="content"
    :headers="headers"
    :print="print"
    @filter="filter"
    @cancell="cancell"
  >
    <template v-slot:filter.options>
      <v-row dense>
        <v-col cols="7">
          <v-text-field v-model="search" label="Pesquisa" hide-details dark />
        </v-col>
        <v-col cols="2">
          <f4-date dark v-if="startDate" v-model="startDate" label="Data Inicial" />
        </v-col>
        <v-col cols="2">
          <f4-date dark v-if="endDate" v-model="endDate" label="Data Final" />
        </v-col>
      </v-row>
    </template>
  </report>
</template>

<script>
import Report from "./Report.vue";
import F4Date from "../Field/F4Date.vue";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      items: [],
      search: "",
      startDate: void 0,
      endDate: void 0,
      content: [],
      headersPDF: ["#", "Data", "Cliente", "Animal", "Serviço", "Status"],
      headers: [
        { text: "#", value: "id", align: "end", width: 80 },
        {
          text: "Data",
          value: "date",
          width: 80,
          getter: o => o.date,
          format: o => this.$func.format.Date(o)
        },
        { 
          text: "Cliente", 
          value: "user.name", 
          getter: o => o.user ? o.user.name : 'Cliente não definido' 
        },
        {
          text: "Animal",
          value: "animal.name",
          width: 150,
          getter: o => o.animal ? o.animal.name : 'Animal não definido'
        },
        {
          text: "Serviço",
          value: "service.description",
          width: 250,
          getter: o => o.service ? o.service.description : 'Serviço não definido'
        },
        {
          text: "Status",
          value: "status",
          width: 150,
          chip: true,
          color: o =>
            o.status == "OK"
              ? "green"
              : o.status == "CF"
              ? "indigo"
              : o.status == "CA"
              ? "error"
              : "primary",
          getter: o =>
            o.status == "OK"
              ? "Finalizado"
              : o.status == "CF"
              ? "Confirmado"
              : o.status == "CA"
              ? "Cancelado"
              : "Aberto"
        }
      ]
    };
  },

  components: {
    Report,
    F4Date
  },

  computed: mapGetters(["company"]),

  methods: {
    ...mapActions(["listSchedules"]),

    filter() {
      this.getItems();
    },

    cancell() {
      this.content = [];
    },

    print(items) {
      return new Promise(Response => {
        let body = items.map(schedule => [
          { text: schedule.id, alignment: "right" },
          {
            text: this.$func.format.Date(schedule.date),
            alignment: "center"
          },
          schedule.user ? schedule.user.name : 'Cliente não definido',
          schedule.animal ? schedule.animal.name : 'Animal não definido',
          schedule.service ? schedule.service.description : 'Serviço não definido',
          schedule.status == "OK"
            ? "Finalizado"
            : schedule.status == "CF"
            ? "Confirmado"
            : schedule.status == "CA"
            ? "Cancelado"
            : "Aberto"
        ]);

        this.content = [
          {
            layout: "lightHorizontalLines",
            table: {
              headerRows: 1,
              widths: [40, 65, "*", 65, 100, 80],
              body: [this.headersPDF, ...body]
            }
          }
        ];

        Response();
      });
    },

    async getItems() {
      this.items = (
        await this.listSchedules({
          company_id: this.company.id,
          dateFirst: this.startDate,
          dateLast: this.endDate
        })
      ).data;
    }
  },

  async mounted() {
    let date = new Date();
    let ndate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.startDate = moment(String(ndate.toISOString())).format("YYYY-MM-DD");
    ndate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.endDate = moment(String(ndate.toISOString())).format("YYYY-MM-DD");
    await this.getItems();
  }
};
</script>