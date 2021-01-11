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
      headersPDF: ["#", "Cliente", "E-mail", "Telefone", "Data Cadastro"],
      headers: [
        { text: "#", value: "id", align: "end", width: 80 },
        { text: "Cliente", value: "name" },
        { text: "E-mail", value: "email", width: 250 },
        { text: "Telefone", value: "phone", width: 150 },
        {
          text: "Data Cadastro",
          value: "createdAt",
          width: 125,
          getter: o => o.createdAt,
          format: o => this.$func.format.Date(o)
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
    ...mapActions(["listClients"]),

    filter() {
      this.getItems();
    },

    cancell() {
      this.content = [];
    },

    print(items) {
      return new Promise(Response => {
        let body = items.map(client => [
          { text: client.id, alignment: "right" },
          client.name,
          client.email,
          client.phone,
          {
            text: this.$func.format.Date(client.createdAt),
            alignment: "center"
          }
        ]);

        this.content = [
          {
            layout: "lightHorizontalLines",
            table: {
              headerRows: 1,
              widths: [40, "*", 150, 80, 80],
              body: [this.headersPDF, ...body]
            }
          }
        ];

        Response();
      });
    },

    async getItems() {
      this.items = (
        await this.listClients({
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