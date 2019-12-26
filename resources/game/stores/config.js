//Tienda que tiene las configuraciones del juego
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        world:{}
    }
})

axios('/api/user/config').then(res =>{
    store.state.world = res.data;
})

export default store;