//Tienda que tiene las configuraciones del juego
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {}
})

axios('/api/user/config').then(res =>{
    store.replaceState(res.data);
})

export default store;