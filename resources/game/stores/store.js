import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import $building from 'Stores/building'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      now: moment().format('YYYY-MM-DD HH:mm:ss'),
      city_id:null,
      city_island_id:null,
      city_name:null,
      island_type:null,
      capital:null,
      total_cities:null
    },
    mutations:
    {
      reloadIslandData(){},
      reloadUserResources(){},
      reloadPopulation(){},
      reloadCities(){},
      changeCityIsland(state,{city_island_id,island_type,capital,total_cities,city_name}){
        state.city_island_id = city_island_id;
        state.island_type = island_type;
        state.capital = capital;
        state.total_cities = total_cities;
        state.city_name = city_name;
      },
      changeCity(state,{city_id}){
        localStorage.setItem('city_id', city_id)
        state.city_id = parseInt(city_id);
      },
      setCityName(state,{name}){
        state.city_name = name
      }
    },
    actions:{
      setCityName: (context,{name}) => {
        context.commit('setCityName',{name:name})
        context.commit('reloadCities')
      }
    },
    getters:{
        getCorruption: state =>{
            //Devuelve la corrupcion de una ciudad donde 1 es que no hay corrupcion
            if(state.capital!=null&&state.total_cities!=null){
                if(state.capital==0){
                    var level =  $building.getters.getBuildingLevel(18)
                    var colonias = state.total_cities - 1;
                    return (1 - (level + 1) / (colonias + 1));
                }else{
                    return 0;
                }
            }else{
                return 0;
            }
        }
    }
})

setInterval(function () {
    store.state.now = moment().format('YYYY-MM-DD HH:mm:ss')
}, 1000)

export default store;
