<template>
  <div>
    <v-container v-if="showPrint" fluid style="padding: 0">
      <iframe :src="src" :style="`width: ${width}; height: ${height}; border-radius: 5px`" />
    </v-container>
    <v-card flat color="color1" v-else>
      <v-card-title style="color: white" header-table>
        <slot name="filter.options">
          <v-row dense>
            <v-col cols="7">
              <v-text-field v-model="search" label="Pesquisa" hide-details dark />
            </v-col>
          </v-row>
        </slot>
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn outlined dark fab small v-on="on" @click="$emit('filter')">
              <v-icon x-small>fas fa-search</v-icon>
            </v-btn>
          </template>
          <span>Filtrar</span>
        </v-tooltip>
      </v-card-title>
      <v-data-table
        dense
        ref="table"
        :headers="headers"
        :items="items"
        :search="search"
        height="calc(100vh - 325px)"
        hide-default-footer
        item-key="id"
        fixed-header
        disable-pagination
        no-data-text="Nenhum registro encontrado"
        loading-text="Carregando... Aguarde."
        table-footer
      >
        <template v-slot:item="{ item }">
          <tr @click="$emit('click:row', item)" @dblclick="$emit('dblclick:row', item)">
            <td
              v-for="header in headers"
              :key="header.text"
              :class="
                            header.align == 'end' 
                            ? 'text-lg-right'
                            : header.align == 'center' 
                            ? 'text-center'
                            : 'text-sm-left'
                        "
            >
              <div v-if="header.buttons">
                <v-icon
                  v-for="button in header.buttons"
                  :key="button.icon"
                  small
                  @click="button.click(item)"
                >{{ button.icon }}</v-icon>
              </div>
              <v-chip
                v-else-if="header.chip"
                :color="header.color ? header.color(item): 'primary'"
                dark
              >{{ getValue(header, item) }}</v-chip>
              <span v-else>{{ getValue(header, item) }}</span>
            </td>
          </tr>
        </template>
        <template v-slot:body.append>
          <tr style="color: white">
            <th
              v-for="header in headers"
              :key="header.text"
              :class="
                            header.align == 'end' 
                            ? 'text-lg-right'
                            : header.align == 'center' 
                            ? 'text-center'
                            : 'text-sm-left'
                        "
            >{{ getFooterValue(header) }}</th>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <v-footer absolute height="70px">
      {{ showPrint ? `${currentItems().length} registros exibidos` : '' }}
      <v-spacer></v-spacer>
      <v-btn v-if="showPrint" dark large color="error" width="150px" @click="cancellReport">CANCELAR</v-btn>
      <v-btn v-else width="150px" outlined large @click="printReport">
        <v-icon style="margin-right: 5px">fas fa-print</v-icon>IMPRIMIR
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    items: { type: Array, required: true },
    search: { type: String, required: true },
    headers: { type: Array, required: true },
    width: { type: [Number, String], default: "100%" },
    height: { type: [Number, String], default: "calc(100vh - 245px)" },
    content: { type: Array, required: true },
    print: { type: Function, required: true }
  },

  data() {
    return {
      src: undefined,
      showPrint: false
    };
  },

  methods: {
    ...mapActions(["report"]),

    async printReport() {
      await this.print(this.currentItems());
      this.getReport();
      this.showPrint = true;
    },

    async cancellReport() {
      this.$emit("cancell");
      this.showPrint = false;
    },

    async getReport() {
      this.src = (await this.report(this.content)).data;
    },

    getValue(header, item) {
      const value = header.getter ? header.getter(item) : item[header.value];
      return header.format ? header.format(value) : value;
    },

    getFooterValue(header) {
      let result = null;

      if (header.sum) {
        result = this.currentItems().reduce((accum, row) => {
          return (
            accum + (header.getter ? header.getter(row) : row[header.value])
          );
        }, 0);

        result = header.format(result);
      }

      return result;
    },

    currentItems() {
      return this.$refs.table
        ? this.$refs.table._data.internalCurrentItems
        : this.items;
    }
  }
};
</script>