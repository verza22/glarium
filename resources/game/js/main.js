import Vue from 'vue'
import Game from 'Js/Game.vue'
import i18n  from 'Lang/index.js'

import "bootstrap-css-only";
import "Sass/main.scss"

require('Js/config')
require('Js/prototypes')


new Vue({
    el:'#app',
    i18n,
    name:'App',
    components:{
        Game
    }
});
