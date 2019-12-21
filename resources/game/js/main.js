import Vue from 'vue'
import Game from 'Js/Game.vue'
import i18n  from 'Lang/index.js'

new Vue({
    el:'#app',
    i18n,
    name:'App',
    components:{
        Game
    }
});