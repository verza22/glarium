//Tienda que tiene los edificios de una ciudad
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import $store from 'Stores/store'
import $notification from 'Stores/notification'
import $config from 'Stores/config'
import moment from "moment";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        buildings:[],
    },
    mutations:{
        updateBuilding(state,{buildings}){
            state.buildings = buildings
        }
    },
    actions:{
        updateBuilding(context){
            return new Promise((resolve,reject) => {
                axios("building/" + $store.state.city_id)
                .then(res => {
                    context.commit('updateBuilding',{buildings:res.data})
                    resolve()
                })
                .catch(err => {
                    $notification.commit('show',{advisor:1,type:false,message:err})
                })
            })
        }
    },
    getters:{
        getBuildingLevel: state => building_id => {
            var building = state.buildings.filter(building => { return building.building_id == building_id })
            return building.length>0 ? building[0].level : 0;
        },
        getProducerLevel: (state,getters) => island_type => {
            var building_id = 0;
            switch(island_type){
                case 1:
                    building_id = 14;
                break;
                case 2:
                    building_id = 15;
                break;
                case 3:
                    building_id = 12;
                break;
                case 4:
                    building_id = 13;
                break;
            }
            return getters.getBuildingLevel(building_id)
        },
        reducerBuilding: (state,getters) => building_id => {
            return (1-((getters.getBuildingLevel(building_id)/100)+$config.getters.reducerBuilding));
        }
    }
})

//Intervalo que verifica el edificio construido y los construye
setInterval(function () {
    var building = store.state.buildings.filter(building =>{return building.constructed_at != null})
    if(building.length>0){
        var constructed_at = building[0].constructed_at
        var time = moment.duration(moment(constructed_at).diff(moment($store.state.now))).asSeconds()
        if(time<=0){
            //Construimos el edificio
            building[0].constructed_at = null;
            store.dispatch('updateBuilding')
        }
    }
}, 1000)

export default store;
