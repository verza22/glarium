//Tienda que administra los movimientos
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        movements:[]
    },
    mutations:{
        updateMovemenet(state,{movements}){
            state.movements = movements
        }
    },
    actions:{
        updateMovemenet: context =>{
            axios('movement').then(res =>{
                if(res.data.length>0){
                    context.commit('updateMovemenet',{
                        movements:res.data
                    });
                }
            })
        }
    }
})

export default store;
