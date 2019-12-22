import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      now: moment().format('YYYY-MM-DD HH:mm:ss'),
      city_id:null,
    },
    mutations: 
    {
      reloadBuilding(){},
      reloadResources(){},
      reloadPopulation(){},
      reloadActionPoint(){},
      changeCity(state,{city_id}){
        state.city_id = city_id;
      }
    }
})

setInterval(function () {
    store.state.now = moment().format('YYYY-MM-DD HH:mm:ss')
 }, 1000)

export default store;