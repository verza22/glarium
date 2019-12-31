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
        sulfur:0,
        apoint:0,
        apoint_max:0
    },
    mutations:
    {
        updateWine(state,{wine}){
            state.wine = wine;
        },
        updateResources(state,{wood,wine,marble,glass,sulfur}){
            state.wood = wood;
            state.wine = wine;
            state.marble = marble;
            state.glass = glass;
            state.sulfur = sulfur;
        },
        produceResources(state,{wood = 0,wine = 0,marble = 0,glass = 0,sulfur = 0}){
            state.wood += wood;
            state.wine += wine;
            state.marble += marble;
            state.glass += glass;
            state.sulfur += sulfur;
        },
        donate(state,{wood}){
            state.wood = state.wood - wood;
        },
        removeResources(state,{wood = 0,wine = 0,marble = 0,glass = 0,sulfur = 0}){
            state.wood -= wood;
            state.wine -= wine;
            state.marble -= marble;
            state.glass -= glass;
            state.sulfur -= sulfur;
        },
        setApoint(state,{apoint,apoint_max}){
            state.apoint = apoint
            state.apoint_max = apoint_max
        },
        removeApoint(state){
            state.apoint -= 1
        },
        addApoint(state){
            state.apoint += 1
        }
    }
});
