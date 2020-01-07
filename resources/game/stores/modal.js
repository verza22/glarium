//Tienda que conecta a el modal
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        info:{},
        type:0
    },
    mutations: {
        openModal(state,{info,type}){
            state.info = info;
            state.type = type;
        },
        updateModal(state,{info,type}){
            state.info = info;
            state.type = type;
        },
        clear(state){
            state.info = {};
            state.type = 0;
        },
        changeRoute(){}
    },
    actions:{
        updateBuildingModal: (context,{id,building_id,level}) =>{
            if(context.state.type==1){
                axios.post("building/nextLevel/" + building_id, {
                    level: level+1
                })
                .then(res => {
                    res.data.city_building_id = id
                    context.commit('updateModal',{
                        type:1,
                        info:res.data
                    })
                })
            }
        }
    }
})
