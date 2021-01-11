<template>
  <v-container fluid>
    <comp-title title="Atendimento"></comp-title>
    <v-dialog v-if="editShedule" v-model="editShedule" persistent max-width="350px">
      <edit :schedule="schedule" @edit:close="editShedule = false" />
    </v-dialog>
    <div class="schedules-div-workspace">
      <template>
        <v-card class="schedules-left-card">
          <div class="div-header">
            <v-flex xs12 sm12 md12>
              <v-text-field v-model="search" append-icon="search" label="Nome" />
            </v-flex>
          </div>
          <div style="overflow-y: auto; height: calc(100vh - 245px)">
            <v-data-table
              :headers="headers"
              :items="openingSchedules"
              :search="search"
              item-key="id"
              hide-default-header
              hide-default-footer
              disable-pagination
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-xs-right">
                    <strong>{{ item.user ? item.user.name: 'Cliente não definido' }}</strong>
                    <br />
                    {{ item.animal ? item.animal.name: 'Pet não definido' }}
                    <br />
                    <strong>{{ item.service ? item.service.description: 'Serviço não definido' }}</strong>
                    <br />
                    {{ $func.format.Date(item.date) + ' ' +item.hour }}
                    <br />
                    <strong v-if="item.taxi_dog == 'S'">Taxi dog</strong>
                    <br />
                    {{ item.observations }}
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" icon @click="showEdit(item)">
                          <v-icon small>fas fa-pen</v-icon>
                        </v-btn>
                      </template>
                      <span>Alterar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" icon @click="confirmSchedule(item)">
                          <v-icon small>fas fa-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Cofirmar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn small v-on="on" icon @click="cancellSchedule(item)">
                          <v-icon small>fas fa-ban</v-icon>
                        </v-btn>
                      </template>
                      <span>Cancelar</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </div>
        </v-card>
        <v-card class="schedules-workspace-card">
          <v-row class="fill-height">
            <v-col>
              <v-toolbar flat>
                <v-btn class="mr-4" @click="setToday">Hoje</v-btn>
                <v-btn fab text small @click="prev">
                  <v-icon small>fas fa-chevron-left</v-icon>
                </v-btn>
                <v-btn fab text small @click="next">
                  <v-icon small>fas fa-chevron-right</v-icon>
                </v-btn>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-menu bottom right>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on">
                      <span>{{ typeToLabel[type] }}</span>
                      <v-icon right>fas fa-caret-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="type = 'day'">
                      <v-list-item-title>Dia</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'week'">
                      <v-list-item-title>Semana</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = 'month'">
                      <v-list-item-title>Mês</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="type = '4day'">
                      <v-list-item-title>4 dias</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-toolbar>
              <v-sheet height="calc(100vh - 253px)">
                <v-calendar
                  ref="calendar"
                  v-model="focus"
                  color="primary"
                  :events="events"
                  :event-color="getEventColor"
                  :type="type"
                  @click:event="showEvent"
                  @click:more="viewDay"
                  @click:date="viewDay"
                  @change="updateRange"
                />
                <v-menu
                  v-model="selectedOpen"
                  :close-on-content-click="false"
                  :activator="selectedElement"
                  offset-x
                >
                  <v-card v-if="selectedEvent.details" width="600px" flat>
                    <v-toolbar :color="selectedEvent.color" dark>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-toolbar-title v-on="on">{{ selectedEvent.name }}</v-toolbar-title>
                        </template>
                        <span>{{ selectedEvent.name }}</span>
                      </v-tooltip>
                      <v-spacer></v-spacer>
                      <v-card-actions v-if="selectedEvent.details.status != 'OK'">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              dark
                              text
                              v-on="on"
                              @click="showEdit(selectedEvent.details)"
                              icon
                            >
                              <v-icon>fas fa-pen</v-icon>
                            </v-btn>
                          </template>
                          <span>Alterar</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              dark
                              text
                              v-on="on"
                              @click="finalizeSchedule(selectedEvent.details)"
                              icon
                            >
                              <v-icon>fas fa-thumbs-up</v-icon>
                            </v-btn>
                          </template>
                          <span>Finalizar</span>
                        </v-tooltip>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn
                              dark
                              text
                              v-on="on"
                              @click="cancellSchedule(selectedEvent.details)"
                              icon
                            >
                              <v-icon>fas fa-ban</v-icon>
                            </v-btn>
                          </template>
                          <span>Cancelar</span>
                        </v-tooltip>
                      </v-card-actions>
                    </v-toolbar>
                    <v-card-text>
                      <strong v-if="selectedEvent.details.taxi_dog == 'S'">Taxi dog</strong>
                      <br />Cliente:
                      <strong
                        v-if="selectedEvent.details.user"
                      >{{ selectedEvent.details.user.name }}</strong>
                      <br />Animal:
                      <strong
                        v-if="selectedEvent.details.animal"
                      >{{ selectedEvent.details.animal.name }}</strong>
                      <br />Profissional:
                      <strong>{{ selectedEvent.details.professional }}</strong>
                      <div v-if="selectedEvent.details.service && selectedEvent.details.service.observations">
                        Observação do serviço:
                        <strong>{{ selectedEvent.details.service.observations }}</strong>
                      </div>
                      <div v-if="selectedEvent.details.observations">
                        Observação:
                        <strong>{{ selectedEvent.details.observations }}</strong>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </div>
  </v-container>
</template>

<script>
import compTitle from "../HeaderFooter/Title.vue";
import Edit from "./Edit.vue";
import moment from "moment";
import { mapActions, mapGetters } from "vuex";
import Message from "@/globals/message";

export default {
  components: {
    compTitle,
    Edit
  },

  mixins: [Message],

  data() {
    return {
      search: "",
      editShedule: false,
      schedule: {},
      headers: [
        {
          value: "user.name"
        }
      ],
      focus: "",
      today: "",
      type: "month",
      typeToLabel: {
        month: "Mês",
        week: "Semana",
        day: "Dia",
        "4day": "4 dias"
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: []
      // colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      // names: ['Reunião', 'Feriado', 'PTO', 'Viagem', 'Evento', 'Aniverssário', 'Conferência', 'Festa'],
    };
  },
  computed: {
    ...mapGetters(["openingSchedules", "closingSchedules", "company"]),
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }

      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;

      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day;
      const endDay = end.day;

      switch (this.type) {
        case "month":
          return `${startMonth} de ${startYear}`;
        case "week":
        case "4day":
          return `${startDay} de ${startMonth} de ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startDay} de ${startMonth} de ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  watch: {
    openingSchedules: function() {
      this.updateRange({
        start: this.start,
        end: this.end
      });
    }
  },
  methods: {
    ...mapActions(["putSchedule"]),
    ...mapActions("moura", ["createSchedule"]),
    
    showEdit(schedule) {
      this.schedule = schedule
      this.editShedule = true
    },

    confirmSchedule(schedule) {
      schedule.status = "CF";
      this.updateSchedule(schedule);
      
      if(this.company.integrated && this.company.id != 15){ //exclusivo para A Casa do Bicho do RJ pois já é integrado
        this.createSchedule({schedule, server: this.company.server}).catch(error => console.error(error));
      }
    },
    finalizeSchedule(schedule) {
      schedule.status = "OK";
      this.updateSchedule(schedule);
    },
    async cancellSchedule(schedule) {
      if (!(await this.confirm('Deseja realmente cancelar este agendamento?', {
        icon: 'warning',
        title: 'Atenção',
        buttons: ['Não', 'Sim']
      })))
        return

      schedule.status = "CA";
      this.updateSchedule(schedule);
    },
    updateSchedule(schedule) {
      this.putSchedule(schedule).then(() => {
        this.selectedOpen = false;
      });
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      const events = [];
      const allDay = false;
      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);

      if (this.closingSchedules)
        this.closingSchedules.forEach(schedule => {
          const first = new Date(schedule.date + "T" + schedule.hour);
          const second = moment(first)
            .add(30, "m")
            .toDate();

          if (schedule.status == "CA") return;

          if (
            !(first instanceof Date && !isNaN(first)) ||
            first <= min ||
            second >= max
          )
            return;

          events.push({
            name: schedule.service ? schedule.service.description : "Serviço",
            start: this.formatDate(first, !allDay),
            end: this.formatDate(second, !allDay),
            color: schedule.status == "OK" ? "green" : "indigo",
            details: schedule
          });
        });

      this.start = start;
      this.end = end;
      this.events = events;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    }
  }
};
</script>
