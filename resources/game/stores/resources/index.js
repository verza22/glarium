import Vue from 'vue'
import Vuex from 'vuex'
import Population from 'Stores/resources/population'
import UserResources from 'Stores/resources/userResources'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        population: Population,
        userResources: UserResources
    },
    state: {
        wood:0,
        wine:0,
        marble:0,
        glass:0,
        sulfur:0
    },
    mutations: 
    {
        updateResources(state,{wood,wine,marble,glass,sulfur}){
            state.wood = wood;
            state.wine = wine;
            state.marble = marble;
            state.glass = glass;
            state.sulfur = sulfur;
        },
        donate(state,{wood}){
            state.wood = state.wood - wood;
        },
        removeResources(state,{wood,wine,marble,glass,sulfur}){
            state.wood -= wood;
            state.wine -= wine;
            state.marble -= marble;
            state.glass -= glass;
            state.sulfur -= sulfur;
        },
    }
});