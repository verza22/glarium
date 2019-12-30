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
        producerWoodLevel:0,
        producerMinerLevel:0,
        depositLevel:0,
        reducerWoodLevel:0,
        reducerWineLevel:0,
        reducerMarbleLevel:0,
        reducerGlassLevel:0,
        reducerSulfurLevel:0,
        reducerResearchBuilding:0
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
        removeResources(state,{wood,wine,marble,glass,sulfur}){
            state.wood -= wood;
            state.wine -= wine;
            state.marble -= marble;
            state.glass -= glass;
            state.sulfur -= sulfur;
        },
        setProducerMiner(state,{level}){
            state.producerMinerLevel = level;
        },
        setReducerResearchBuilding(state,{level}){
            state.reducerResearchBuilding = level;
        },
        setBuilding(state,{buildings}){
            buildings.forEach(building =>{
                switch(building.building_id){
                    case 3:
                        state.depositLevel = building.level;
                    break;
                    case 5:
                        state.population.wine_max = 12*building.level;
                    break;
                    case 6:
                        state.reducerWoodLevel = building.level;
                    break;
                    case 7:
                        state.reducerGlassLevel = building.level;
                    break;
                    case 8:
                        state.reducerSulfurLevel = building.level;
                    break;
                    case 9:
                        state.reducerWineLevel = building.level;
                    break;
                    case 10:
                        state.reducerMarbleLevel = building.level;
                    break;
                    case 11:
                        state.producerWoodLevel = building.level;
                    break;
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                        state.producerMinerLevel = building.level;
                    break;
                }
            })
        }
    },
    getters: {
      reducerWoodBuilding: state => {
        return (1-((state.reducerWoodLevel/100)+state.reducerResearchBuilding));
      },
      reducerWineBuilding: state => {
        return (1-((state.reducerWineLevel/100)+state.reducerResearchBuilding));
      },
      reducerMarbleBuilding: state => {
        return (1-((state.reducerMarbleLevel/100)+state.reducerResearchBuilding));
      },
      reducerGlassBuilding: state => {
        return (1-((state.reducerGlassLevel/100)+state.reducerResearchBuilding));
      },
      reducerSulfurBuilding: state => {
        return (1-((state.reducerSulfurLevel/100)+state.reducerResearchBuilding));
      }
    }
});
