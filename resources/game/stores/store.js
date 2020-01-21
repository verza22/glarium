import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
      now: moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    mutations:
    {
      reloadIslandData(){},
      reloadUserResources(){},
      reloadPopulation(){},
    }
})

setInterval(function () {
    store.state.now = moment().format('YYYY-MM-DD HH:mm:ss')
}, 1000)

export default store;
