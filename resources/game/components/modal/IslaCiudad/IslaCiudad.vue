<template>
    <div class="mBorder">
        <Ventana1 :close='close' v-if='type!=0' :titulo="getTitle()">
            <Diplomacia :changeType='changeType' :data='info' v-if='type==1||type==3'></Diplomacia>
            <Transporte :changeType='changeType' :data='info' v-else-if='type==2'></Transporte>
            <Defensa :changeType='changeType' :data='info' v-else-if='type==4'></Defensa>
            <Ataque :changeType='changeType' :data='info' v-else-if='type==5'></Ataque>
        </Ventana1>
        <Ventana2 titulo="Info" v-if='type!=3'>
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
import Diplomacia from 'Components/modal/IslaCiudad/Opciones/Diplomacia.vue'
import Transporte from 'Components/modal/IslaCiudad/Opciones/Transporte.vue'
import Defensa from 'Components/modal/IslaCiudad/Opciones/Defensa.vue'
import Ataque from 'Components/modal/IslaCiudad/Opciones/Ataque.vue'
import $city from 'Stores/city'

export default {
    name: 'IslaCiudad',
    props:['info','close'],
    components:{
        Ventana1,
        Ventana2,
        Info,
        Acciones,
        Diplomacia,
        Transporte,
        Defensa,
        Ataque
    },
    data(){
        return {
            type:0
        }
    },
    methods:{
        changeType(type){
            this.type = type
            if(type==0){
                this.close()
            }
        },
        getTitle(){
            switch(this.type){
                case 1:
                    return "Escribir mensaje";
                break;
                case 2:
                    return "Transportar recursos";
                break;
                case 5:
                    return "Saquear";
                break;
            }
        }
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        }
    },
    beforeMount(){
        if(this.info.type!=undefined){
            this.type = this.info.type
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>
