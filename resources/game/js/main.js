import Vue from 'vue'
import Game from 'Js/Game.vue'
import i18n  from 'Lang/index.js'
require('Js/config')


new Vue({
    el:'#app',
    i18n,
    name:'App',
    components:{
        Game
    }
});