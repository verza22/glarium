//Tienda que administra los movimientos
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        regiments:[]
    },
    mutations:{
        updateUnit(state,{movements}){
            state.movements = movements
        }
    },
    actions:{
        updateUnit: context =>{
            return new Promise(resolve=>{
                axios('unit').then(res =>{
                    context.state.regiments = res.data
                })
                .then(function () {
                    resolve('ok')
                });
            })
        }
    },
    getters:{
        getRegimentCity: state => (city_id) => {
            return state.regiments.filter(regiment =>{
                return regiment.city_id = city_id
            })
        },
        getUnits: (state,getters) => (city_id) =>{
            var regiments = getters.getRegimentCity(city_id)
            if(regiments.length>0){
                return regiments[0].units;
            }else{
                return []
            }
        },
        getTails: (state,getters) => (city_id) =>{
            var regiments = getters.getRegimentCity(city_id)
            if(regiments.length>0){
                return regiments[0].tails;
            }else{
                return []
            }
        }
    }
})


//Intervalo que verifica y termina las colas
var control = true;
setInterval(function () {
    if(store.state.regiments.length>0){
        store.state.regiments.forEach(regiment=>{
            if(regiment.tails.length>0){
                regiment.tails.forEach(tail=>{
                    if(moment.duration(moment(tail.constructed_at).diff(moment())).asSeconds()<0){
                        if(control){
                            control = false
                            store.dispatch('updateUnit')
                            .then(function () {
                                control = true
                            })
                        }
                    }
                })
            }
        })
    }
}, 1000)

export default store;
