import axios from 'axios'
import $store from 'Stores/store'
import $config from 'Stores/config'
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
            state.population = parseInt(population);
            state.worker_forest = parseInt(worker_forest);
        },
        setWorkerMine(state,{population,worker_mine}){
            state.population = parseInt(population);
            state.worker_mine = parseInt(worker_mine);
        },
        reducePopulation(state,{population}){
            state.population -= population
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
                state.wine_max = data.wine_max;
                state.wine = data.wine;
            })
        },
        setWineTavern(state,{wine}){
            state.wine = wine;
        },
        increasePopulation(state,{increasePopulation}){
            state.population += increasePopulation;
            state.population_now += increasePopulation;
        }
    },
    getters: {
        bonuses: state => {
            //Obtenemos los buff de la ciudad
            var bonuses = 196;
            var tavern_level = state.wine_max/12;
            if(tavern_level>0){
                var per_wine = state.wine/state.wine_max;
                var bonus_wine = ( ( tavern_level * 60 ) * per_wine );
                bonuses += (bonus_wine * $config.state.world.bonus.tavern); //Sumamos el bonus por servir vino
                bonuses += ((tavern_level * 12) * $config.state.world.bonus.tavern); //12 de bonus por cada nivel de taberna
            }
            bonuses += $config.state.user_research.includes(9) ? 25 : 0;
            var capital = $store.state.capital;
            bonuses += capital==1&&$config.state.user_research.includes(12) ? 50 : 0;
            return bonuses;
        },
        debuff: state => {
            return state.population_now;
        },
        tavernConsume: state => {
            return state.wine * $config.state.world.bonus.tavern_consume;
        }
    }
}
