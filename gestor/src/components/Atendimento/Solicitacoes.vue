<template>
  <v-layout wrap>
    <v-flex class="left-group">
      <v-card-title>
        <v-flex xs5 sm5 md5>
          <v-text-field v-model="search" append-icon="search" label="Nome" hide-details />
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs6 sm6 md6>
          <v-combobox v-model="select" :items="items" chip>
            <template v-slot:selection="data">
              <v-chip
                :key="JSON.stringify(data.item)"
                :selected="data.selected"
                :disabled="data.disabled"
                class="v-chip--select-multi"
                @click.stop="data.parent.selectedIndex = data.index"
                @input="data.parent.selectItem(data.item)"
              >
                <!-- <v-avatar class="accent white--text">
                                  {{ data.item.slice(0, 1).toUpperCase() }}
                </v-avatar>-->
                {{ data.item }}
              </v-chip>
            </template>
          </v-combobox>
        </v-flex>
      </v-card-title>
      <v-layout column>
        <v-flex class="grid-left">
          <v-data-table
            :headers="headers"
            :items="desserts"
            :search="search"
            hide-headers
            hide-actions
          >
            <template v-slot:items="props">
              <td class="text-xs-left">
                <v-list-tile-content>
                  <v-list-tile-title>
                    <strong>{{ props.item.name }}</strong>
                  </v-list-tile-title>
                  <v-list-tile-sub-title style="font-size: 15px">{{ props.item.cod }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </td>
            </template>
            <template v-slot:no-results>
              <v-alert
                :value="true"
                color="error"
                icon="warning"
              >Your search for "{{ search }}" found no results.</v-alert>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-main class="area">
      <v-container></v-container>
    </v-main>
    <v-card class="footer-area"></v-card>
  </v-layout>
</template>

<script src="../../pedidos.js"></script>