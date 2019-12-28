import axios from 'axios'
import $store from 'Stores/store'
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
        setWorkerForest(state,{population,worker_forest}){
            state.population = population;
            state.worker_forest = worker_forest;
        },
        setWorkerMine(state,{population,worker_mine}){
            state.population = population;
            state.worker_mine = worker_mine;
        },
        setScientists(state,{population,scientists}){
            //Sumamos a los investigadores globales
            this.state.userResources.total_scientists += (scientists - state.scientists)
            state.population = population;
            state.scientists = scientists;
        },
        reloadPopulation(state){
            axios("city/getPopulation/" + $store.state.city_id)
            .then(res => {
                var data = res.data;
                state.population = data.population;
                state.population_max = data.population_max;
                state.population_now = data.population + (data.worker_forest + data.worker_mine + data.scientists);
                state.worker_forest = data.worker_forest;
                state.worker_mine = data.worker_mine;
                state.scientists_max = data.scientists_max;
                state.scientists = data.scientists;
            })
        }
    }
}