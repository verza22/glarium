//Tienda que administra los movimientos
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        movement:[]
    },
    mutations:{
        updateMovemenet(state,{movement}){
            state.movement = movement
        }
    },
    actions:{
        updateMovemenet: context =>{
            axios('movement').then(res =>{
                if(res.data.movement.length>0){
                    debugger
                    context.commit('updateMovemenet',{
                        movement:res.data.movement
                    });
                }
            })
        }
    }
})

export default store;
