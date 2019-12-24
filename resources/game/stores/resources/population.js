//Modolo de los recursos de poblacion
export default {
    state: {
        population_max:0,
        population_now:0,
        population:0,
        worker_forest:0,
        worker_mine:0,
        scientists_max:0,
        scientists:0,
        wine_max:0,
        wine:0,
    },
    mutations:{
        updatePopulation(state,{population_max,population,population_now,worker_forest,worker_mine,scientists_max,scientists}){
            state.population = population;
            state.population_max = population_max;
            state.population_now = population_now;
            state.worker_forest = worker_forest;
            state.worker_mine = worker_mine;
            state.scientists_max = scientists_max;
            state.scientists = scientists;
        },
        setWorkerForest(state,{population,worker_forest}){
            state.population = population;
            state.worker_forest = worker_forest;
        },
        setWorkerMine(state,{population,worker_mine}){
            state.population = population;
            state.worker_mine = worker_mine;
        }
    }
}