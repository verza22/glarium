import Vue from 'vue'
import VModal from 'vue-js-modal'

import Game from 'Js/Game.vue'
import i18n  from 'Lang/index.js'

require('Js/config')

Vue.use(VModal)

new Vue({
    el:'#app',
    i18n,
    name:'App',
    components:{
        Game
    }
});