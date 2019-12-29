//Tienda que administra las notificaciones
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        advisor:1,
        type:true,
        message:'',
    },
    mutations:{
        show(state,{advisor,type,message}){
            state.advisor = advisor;
            state.type = type;
            state.message = message;
        }
    }
})
