<template>
  <div>
    <v-text-field dense outlined label="Título" v-model="title" counter="60" maxlength="60"></v-text-field>
    <v-textarea
      ref="message"
      dense
      outlined
      no-resize
      label="Menssagem"
      v-model="message"
      counter="120"
      maxlength="120"
      append-icon="fas fa-smile-wink"
      @click:append="showEmoji = !showEmoji"
    />
    <v-emoji-picker v-if="showEmoji" @select="selectEmoji" class="emojis" />
    <v-footer absolute height="70px">
      <v-spacer />
      <v-btn large color="color1" width="150px" @click="sendNotification">Enviar</v-btn>
    </v-footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";
import VEmojiPicker from "v-emoji-picker"

export default Vue.extend({
  data() {
    return {
      title: "",
      message: "",
      showEmoji: false,
      x: 0,
      y: 0
    };
  },

  components: {
    VEmojiPicker
  },

  computed: mapGetters(["company"]),

  methods: {
    ...mapActions(["notification"]),
    async sendNotification() {
      await this.notification({
        company_id: this.company.id,
        title: this.title,
        message: this.message
      });

      this.title = "";
      this.message = "";
    },
    
    selectEmoji(emoji) {
      this.message += emoji.data
      this.showEmoji = false

      this.$refs.message.focus()
    }
  }
});
</script>