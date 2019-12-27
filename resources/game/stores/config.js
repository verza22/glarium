//Tienda que tiene las configuraciones del juego
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        world:{},
        research:[],
        user_research:[],
    },
    mutations:{
        updateResearch(state,{user_research}){
            state.user_research = user_research
        }
    }
})

axios('/api/user/config').then(res =>{
    store.state.world = res.data.world;
    store.state.research = res.data.research;
    store.state.user_research = res.data.user_research;
})

export default store;