//Tienda que administra los movimientos
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'
import $store from 'Stores/store'
import $city from 'Stores/city'
import $resources from 'Stores/resources'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        movements:[],
        movementEnd:[],
        movementReturn:[]
    },
    mutations:{
        updateMovemenet(state,{movements}){
            state.movements = movements
        }
    },
    actions:{
        updateMovemenet: context =>{
            axios('movement').then(res =>{
                context.commit('updateMovemenet',{
                    movements:res.data
                });
            });
        }
    }
})


//Intervalo que verifica y termina los movimientos
setInterval(function () {
    if(store.state.movements.length>0){
        store.state.movements.forEach((movement,index)=>{
            var control = false;
            if(moment.duration(moment(movement.end_at).diff(moment())).asSeconds()<=0 && !store.state.movementEnd.includes(movement.id)){
                control = true
            }
            if(moment.duration(moment(movement.return_at).diff(moment())).asSeconds()<=0 && !store.state.movementReturn.includes(movement.id)){
                control = true
            }
            //Terminamos el movimiento
            if(control){
                //actualizamos el movimiento
                store.dispatch('updateMovemenet')
                if(moment.duration(moment(movement.end_at).diff(moment())).asSeconds()<=0){
                    store.state.movementEnd.push(movement.id)
                }
                if(moment.duration(moment(movement.return_at).diff(moment())).asSeconds()<=0){
                    store.state.movementReturn.push(movement.id)
                }
                /*store.state.movements.splice(index,1)
                axios.put('movement').then(res =>{
                    /*$resources.commit('addTradeShip',{ships:movement.trade_ship})
                    if($city.state.city_id==movement.city_from.id){
                        $resources.commit('addApoint')
                    }
                    switch(movement.movement_type_id){
                        case 1:
                            if($city.state.city_id==movement.city_to.id){
                                $resources.commit('produceResources',movement.resources)
                            }
                        break;
                        case 4:
                            $city.commit('reloadCities')
                            $store.commit('reloadIslandData')
                        break;
                    }
                })*/
            }
        })
    }
}, 1000)

export default store;
