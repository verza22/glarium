import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      now: moment().format('YYYY-MM-DD HH:mm:ss'),
      city_id:null,
      city_island_id:null,
      island_type:null
    },
    mutations:
    {
      reloadBuilding(){},
      reloadUserResources(){},
      reloadResources(){},
      reloadPopulation(){},
      reloadActionPoint(){},
      reloadCities(){},
      changeCityIsland(state,{city_island_id,island_type}){
        state.city_island_id = city_island_id;
        state.island_type = island_type;
      },
      changeCity(state,{city_id,island_type=null}){
        localStorage.setItem('city_id', city_id)
        state.city_id = city_id;
        state.island_type = island_type;
      }
    }
})

setInterval(function () {
    store.state.now = moment().format('YYYY-MM-DD HH:mm:ss')
 }, 1000)

export default store;
