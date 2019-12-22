//Modolo de los recursos de poblacion
export default {
    state: {
        population_max:0,
        population:0,
        worker_forest:0,
        worker_mine:0,
        wine_max:0,
        wine:0,
        scientists_max:0,
        scientists:0
    },
    mutations:{
        updatePopulaton(state,{population_max,population}){
            state.population = population;
            state.population_max = population_max;
        }
    }
}