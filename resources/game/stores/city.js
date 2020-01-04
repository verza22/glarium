//Tienda que tiene las configuraciones de la ciudad
import Vue from 'vue'
import Vuex from 'vuex'
import $building from 'Stores/building'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        city_id:0,
        city:{},
        island:{},
        cities:[]
    },
    mutations:{
        reloadCities(){},
        setCityId(state,{city_id}){
            state.city_id = parseInt(city_id)
        },
        changeCity(state,{city}){
            state.city = city
            localStorage.setItem('city_id', city.id)
        },
        setCities(state,{cities}){
            state.cities = cities
        },
        setCityName(state,{name}){
          state.city.name = name
        },
        setIsland(state,{island}){
          state.island = island
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
            if(state.city.capital==0){
                var level =  $building.getters.getBuildingLevel(18)
                var colonias = state.cities.length - 1;
                return (1 - (level + 1) / (colonias + 1));
            }else{
                return 0;
            }
        }
    }
})
