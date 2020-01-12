//Tienda que administra los movimientos
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

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
    },
    getters:{
        getType: state => (movement,checkHorario) =>{
            switch(checkHorario(movement)){
                case 1:
                    return 'start_at';
                break;
                case 2:
                    return 'end_at';
                break;
                case 3:
                    return 'return_at';
                break;
            }
        },
        movements: (state,getters) => (checkHorario) =>{
            return state.movements.sort(function(a, b){
                var type_a = getters.getType(a,checkHorario)
                var type_b = getters.getType(b,checkHorario)
                return moment.utc(a[type_a]).diff(moment.utc(b[type_b]))
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
            }
        })
    }
}, 1000)

export default store;
