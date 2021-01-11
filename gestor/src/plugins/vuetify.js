import Vue from 'vue'
import colors from 'vuetify/lib/util/colors'
import Vuetify from 'vuetify/lib'
import { themes } from '../globals/themes'
import pt from 'vuetify/es5/locale/pt'
import { store } from '@/store/store'

Vue.use(Vuetify)

themes.cyan.light.select_highlight = colors.grey.lighten2;
themes.cyan.dark.select_highlight = colors.grey.darken2;

export default new Vuetify({
    theme: {
        dark: store.getters.user ? store.getters.user.darkMode : true,
        options: {
            customProperties: true,
        },
        themes: themes.cyan
    },
    icons: {
        iconfont: 'fa' || 'mdiSvg' || 'mdi' || 'md' || 'fa4'
    },
    lang: {
        locales: { pt },
        current: 'pt',
    },
})