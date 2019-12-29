//Tienda que conecta a el modal
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        info:{},
        type:0
    },
    mutations: {
        openModal(state,{info,type}){
            state.info = info;
            state.type = type;
        },
        updateModal(state,{info,type}){
            state.info = info;
            state.type = type;
        },
        changeRoute(){}
    },
})
