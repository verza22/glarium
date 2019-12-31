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
    },
    getters:{
        reducerBuilding: state =>{
            var reducerBuilding = 0
            reducerBuilding += state.user_research.includes(3) ? 0.02 : 0
            reducerBuilding += state.user_research.includes(7) ? 0.04 : 0
            reducerBuilding += state.user_research.includes(10) ? 0.08 : 0
            return reducerBuilding
        },
        scientists_cost: state => {
            return state.user_research.includes(17) ? 3: 6;
        }
    }
})

axios('/api/user/config').then(res =>{
    store.state.world = res.data.world;
    store.state.research = res.data.research;
    store.commit('updateResearch',{user_research:res.data.user_research})
})

export default store;
