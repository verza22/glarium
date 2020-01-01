<template>
    <div class="box">
        <div class="text-justify mb-3">Selecciona cuales y cuantos bienes deseas trasladar de {{city_from.name}} a {{data.city.name}}. ¡Ten en cuenta la cantidad de barcos mercantes que necesitarás a tal efecto!</div>
        <MoverRecursos :values='values' :changeSize='changeSize'></MoverRecursos>
        <InformeTransporte btnTitle='¡Transportar bienes!' :call='enviar' :objetivo='data.city.name' :size='size'></InformeTransporte>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import InformeTransporte from 'Components/modal/IslaCiudad/Componentes/InformeTransporte.vue'
import MoverRecursos from 'Components/modal/IslaCiudad/Componentes/MoverRecursos.vue'
import $city from 'Stores/city'
import $config from 'Stores/config'
import $resources from 'Stores/resources'
import $movement from 'Stores/movement'

export default {
    name:'Transporte',
    props:['data','changeType'],
    components:{
        InformeTransporte,
        MoverRecursos
    },
    data(){
        return {
            size:0,
            values:[0,0,0,0,0],
            ships:0
        }
    },
    methods:{
        changeSize(size){
            this.size = size;
            this.ships = Math.ceil(this.size/this.transport)
        },
        enviar(){
            axios.post("movement/transport/" + this.city_from.id, {
                city_to: this.data.city.city_id,
                wood:this.values[0],
                wine:this.values[1],
                marble:this.values[2],
                glass:this.values[3],
                sulfur:this.values[4]
            })
            .then(res => {
                if(res.data=='ok'){
                    this.changeType(0)
                    $resources.commit('removeApoint')
                    $resources.commit('removeResources',{wood:this.values[0],wine:this.values[1],marble:this.values[2],glass:this.values[3],sulfur:this.values[4]})
                    $resources.commit('useShip',{ships:this.ships})
                    $movement.dispatch('updateMovemenet')
                    $notification.commit('show',{advisor:1,type:true});
                }else{
                    $notification.commit('show',{advisor:1,type:false,message:res.data});
                }
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        }
    },
    computed:{
        city_from(){
            return $city.state.city;
        },
        transport(){
            return $config.state.world.transport;
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
