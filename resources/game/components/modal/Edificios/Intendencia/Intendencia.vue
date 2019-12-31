<template>
    <div class="box pt-0">
        <NombreCiudad v-if='show' :showChangeCity='showChangeCity' :nombre='city_name'></NombreCiudad>
        <div class="gtitle boton text-center" @click='showChangeCity'>{{capital==1 ? 'Capital' : 'Colonia'}} {{city_name}}</div>
        <Informacion></Informacion>
        <Aviso></Aviso>
        <Satisfaccion></Satisfaccion>
    </div>
</template>

<script>
import Informacion from 'Components/modal/Edificios/Intendencia/Informacion.vue'
import Aviso from 'Components/modal/Edificios/Intendencia/Aviso.vue'
import Satisfaccion from 'Components/modal/Edificios/Intendencia/Satisfaccion.vue'
import NombreCiudad from 'Components/modal/Edificios/Intendencia/NombreCiudad.vue'
import $store from 'Stores/store'

export default {
    name:'Intendencia',
    components:{
        Informacion,
        Aviso,
        Satisfaccion,
        NombreCiudad
    },
    data(){
        return {
            show: false
        }
    },
    methods:{
        showChangeCity(){
            this.show = !this.show;
        }
    },
    computed:{
        city_name(){
            return $store.state.city_name;
        },
        capital(){
            return $store.state.capital;
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    .boton{
        cursor: pointer;
    }
</style>
