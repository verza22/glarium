import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      now: moment().format('YYYY-MM-DD HH:mm:ss'),
      city_id:null,
      city_island_id:null,
    },
    mutations: 
    {
      reloadBuilding(){},
      reloadUserResources(){},
      reloadResources(){},
      reloadPopulation(){},
      reloadActionPoint(){},
      reloadCities(){},
      changeCityIsland(state,{city_island_id}){
        state.city_island_id = city_island_id;
      },
      changeCity(state,{city_id}){
        localStorage.setItem('city_id', city_id)
        state.city_id = city_id;
      }
    }
})

setInterval(function () {
    store.state.now = moment().format('YYYY-MM-DD HH:mm:ss')
 }, 1000)

export default store;