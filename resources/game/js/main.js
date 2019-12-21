import Vue from 'vue'
import Game from 'Js/Game.vue'
import Lang from 'Lang/index'

new Vue({
    el:'#app',
    Lang,
    name:'App',
    components:{
        Game
    }
});