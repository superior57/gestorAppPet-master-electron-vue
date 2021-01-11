<template>
  <v-card flat color="color1">
    <v-card-title style="color: white">
      <span v-if="title != ''">{{ title }}</span>
      <v-spacer v-if="title" />
      <v-text-field v-model="search" append-icon="search" label="Pesquisa" hide-details dark />
      <v-spacer v-if="$listeners['click:new']" />
      <v-tooltip left v-if="$listeners['click:new']">
        <template v-slot:activator="{ on }">
          <v-btn outlined dark fab small v-on="on" @click="$emit(`click:new`, $event)">
            <v-icon>fas fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Novo</span>
      </v-tooltip>
    </v-card-title>

    <v-data-table
      dense
      :height="height"
      :headers="headers"
      :items="innerItems"
      :loading="innerLoading"
      :search="getDataFromApi ? undefined : search"
      hide-default-footer
      :options.sync="innerOptions"
      disable-pagination
      disable-items-per-page
      item-key="id"
      fixed-header
      no-data-text="Nenhum registro encontrado"
      loading-text="Carregando... Aguarde."
    >
      <template v-slot:item="props">
        <tr @click="$emit(`click:row`, props.item)" @dblclick="$emit(`dblclick:row`, props.item)">
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
                @click="button.click(props.item)"
              >{{ button.icon }}</v-icon>
            </div>
            <div v-else-if="header.list">
              <div
                v-for="(value, i) in header.getter(props.item)"
                :key="i"
                style="line-height: 100%"
              >
                <span
                  :style="typeof value === 'string' ? '': value.style"
                >{{ typeof value === 'string' ? value : value.text }}</span>
              </div>
            </div>
            <v-chip
              v-else-if="header.chip"
              :color="header.color ? header.color(props.item): 'primary'"
              dark
            >{{ header.getter ? header.getter(props.item) : props.item[header.value] }}</v-chip>
            <span v-else>{{ header.getter ? header.getter(props.item) : props.item[header.value] }}</span>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-pagination 
      v-if="totalPages" 
      v-model="innerOptions.page" 
      :length="totalPages"
      total-visible="5"
      circle
    />

    <v-footer color="color1" height="40px" dark>
      {{ instruction }}
      <v-spacer />
      {{ typeof information === "function" ? information() : information }}
    </v-footer>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    title: String,
    information: [String, Function],
    instruction: String,
    height: [String, Number],
    headers: Array,
    items: Array,
    loading: Boolean,
    hideDefaultFooter: Boolean,
    disablePagination: Boolean,
    getDataFromApi: Function,
    options: Object
  },

  data() {
    return {
      search: "",
      innerLoading: false,
      innerItems: [],
      innerOptions: {},
      totalPages: undefined,
      totalItems: 0,
      page: undefined
    };
  },

  computed: mapGetters(["company"]),

  watch: {
    innerOptions: {
      async handler () {
        await this.refresh()
      },
      deep: true,
    },

    search () {
      this.refresh()
    },

    items: {
      handler (val) {
        this.innerItems = val
      },
      deep: true,
    },

    loading(val) {
      this.innerLoading = val
    }
  },

  methods: {
    async refresh () {
      if (!this.getDataFromApi) return
      
      try {
        this.innerLoading = true

        const { itemsPerPage, page, sortBy, sortDesc } = this.innerOptions

        const data = (await this.getDataFromApi({ company_id: this.company.id, page, itemsPerPage, sortBy, sortDesc, search: this.search, empty: '' })).data
                
        this.innerItems = data.docs
        this.totalPages = data.pages
        this.totalItems = data.total
      } finally {
        this.innerLoading = false        
      }
    },

    count () {
      return this.totalItems
    }
  },

  mounted () {
    this.innerItems = this.items || []
    this.innerLoading = this.loading || false
    this.innerOptions = this.options || { 
      page: 1, 
      itemsPerPage: 80
    }
  }
};
</script>