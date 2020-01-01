<template>
    <div class="box">
        <div class="text-justify mb-3">Selecciona cuales y cuantos bienes deseas trasladar de {{city_from.name}} a {{data.city.name}}. ¡Ten en cuenta la cantidad de barcos mercantes que necesitarás a tal efecto!</div>
        <MoverRecursos :changeSize='changeSize'></MoverRecursos>
        <InformeTransporte btnTitle='¡Transportar bienes!' :call='enviar' :objetivo='data.city.name' :size='size'></InformeTransporte>
    </div>
</template>

<script>
import InformeTransporte from 'Components/modal/IslaCiudad/Componentes/InformeTransporte.vue'
import MoverRecursos from 'Components/modal/IslaCiudad/Componentes/MoverRecursos.vue'
import $city from 'Stores/city'

export default {
    name:'Transporte',
    props:['data'],
    components:{
        InformeTransporte,
        MoverRecursos
    },
    data(){
        return {
            size:0
        }
    },
    methods:{
        changeSize(size){
            this.size = size;
        },
        enviar(){

        }
    },
    computed:{
        city_from(){
            return $city.state.city;
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
</style>
