<template>
    <div class="mBorder">
        <Ventana1 :close='close' v-if='type!=0' titulo="Escribir mensaje">
            <Diplomacia :changeType='changeType' :data='info' v-if='type==1'></Diplomacia>
            <!--<Transport :changeType='changeType' :data='info' v-if='type==2'></Transport>-->
        </Ventana1>
        <Ventana2 titulo="Info">
            <Info :data='info'></Info>
            <Acciones :data='info' :changeType='changeType' v-if='city_id!=info.city.city_id'></Acciones>
        </Ventana2>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Ventana2 from 'Components/modal/Ventanas/Ventana2.vue'
import Info from 'Components/modal/IslaCiudad/Info.vue'
import Acciones from 'Components/modal/IslaCiudad/Acciones.vue'
import Diplomacia from 'Components/modal/IslaCiudad/Diplomacia.vue'
import $city from 'Stores/city'

export default {
    name: 'IslaCiudad',
    props:['info','close'],
    components:{
        Ventana1,
        Ventana2,
        Info,
        Acciones,
        Diplomacia
    },
    data(){
        return {
            type:0
        }
    },
    methods:{
        changeType(type){
            this.type = type
        }
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        }
    },
    beforeMount(){
        //debugger
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>
