<template>
    <div class="mb-3">
        <form @submit='enviar'>
        <div class="gtitle text-center mb-2">Cambiar el nombre de la ciudad</div>
        <div class="d-flex">
            <div class="flex-2">
                <div class="celda">Nombre anterior de la ciudad:</div>
                <div class="celda">Nuevo nombre de la ciudad:</div>
            </div>
            <div class="flex-4">
                <div class="gtitle celda">{{nombre}}</div>
                <div class="celda"><input type="text" v-model='name' required maxlength="30"></div>
            </div>
        </div>
        <div class="text-center">
            <button class="btnGeneral" type="submit">Aceptar nombre</button>
        </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import $store from 'Stores/store'

export default {
    name:'NombreCiudad',
    props:['nombre','showChangeCity'],
    data(){
        return {
            name:''
        }
    },
    methods:{
        enviar(e){
            e.preventDefault()
            axios.post('city/setName/'+this.city_id,{
                name:this.name
            })
            .then(res =>{
                if(res.data!='ok'){
                    $notification.commit('show',{advisor:1,type:false,message:res.data});
                }else{
                    $store.dispatch('setCityName',{name:this.namey})
                    this.name = '';
                    this.showChangeCity()
                    $notification.commit('show',{advisor:1,type:true});
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:1,type:false,message:err});
            })
        }
    },
    computed:{
        city_id(){
            return $store.state.city_id;
        }
    }
}
</script>

<style lang="scss" scoped>
    .celda{
        padding: 5px 0px;
    }
</style>
