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
      headersPDF: ["#", "Cliente", "Status", "Data", "Cupom", "Subtotal"],
      headers: [
        { text: "#", value: "id", align: "end", width: 80 },
        { 
          text: "Cliente", 
          value: "user.name", 
          getter: o => o.user ? o.user.name : 'Cliente não definido' 
        },
        {
          text: "Status",
          value: "status",
          width: 150,
          chip: true,
          color: o =>
            o.status == "OK"
              ? "teal"
              : o.status == "ET"
              ? "amber"
              : o.status == "CA"
              ? "error"
              : "primary",
          getter: o =>
            o.status == "OK"
              ? "Concluído"
              : o.status == "ET"
              ? "Em transito"
              : o.status == "CA"
              ? "Cancelado"
              : "Aberto"
        },
        {
          text: "Data",
          value: "createdAt",
          width: 80,
          getter: o => o.createdAt,
          format: o => this.$func.format.Date(o)
        },
        { text: "Cupom", value: "coupon", width: 200 },
        {
          text: "Subtotal",
          value: "subtotal",
          align: "end",
          width: 120,
          sum: true,
          getter: o => o.subtotal,
          format: o => this.$func.format.Money(o)
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
    ...mapActions(["listOrders"]),

    footerPDF(items) {
      return [
        { text: "TOTAL", fontSize: 13, bold: true },
        "",
        "",
        "",
        "",
        {
          text: this.$func.format.Money(
            items.reduce((acc, val) => acc + val.subtotal, 0)
          ),
          alignment: "right",
          fontSize: 13,
          bold: true
        }
      ];
    },

    filter() {
      this.getItems();
    },

    cancell() {
      this.content = [];
    },

    print(items) {
      return new Promise(Response => {
        let body = items.map(sale => [
          { text: sale.id, alignment: "right" },
          sale.user ? sale.user.name : 'Cliente não definido',
          sale.status == "OK"
            ? "Concluído"
            : sale.status == "ET"
            ? "Em transito"
            : sale.status == "CA"
            ? "Cancelado"
            : "Aberto",
          { text: this.$func.format.Date(sale.createdAt), alignment: "center" },
          sale.coupon,
          { text: this.$func.format.Money(sale.subtotal), alignment: "right" }
        ]);

        this.content = [
          {
            layout: "lightHorizontalLines",
            table: {
              headerRows: 1,
              widths: [40, "*", 80, 65, 65, 80],
              body: [this.headersPDF, ...body, this.footerPDF(items)]
            }
          }
        ];

        Response();
      });
    },

    async getItems() {
      this.items = (
        await this.listOrders({
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