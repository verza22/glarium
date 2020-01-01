<template>
    <div class="mBorder">
        <Ventana1 :close='close' :titulo="$t('colonize.title')">
        <div class="box">
            <div class="text-justify">Aquí puedes fundar una colonia. Las colonias son ciudades como tu capital, aunque son controladas por esta última. El nivel de construcción del palacio ubicado en tu capital indica el número de colonias que puedes fundar. Así pues, para poder tener muchas colonias, deberás ir ampliando tu palacio.</div>
            <div class="d-flex mt-4 mb-2">
                <div class="flex-1 text-center">
                    <img :src="require('Img/ciudad/1.png')">
                </div>
                <div class="flex-2 d-flex align-items-center">
                    <div class="requisitos">
                        <div class="gtitle mb-2">Para fundar una colonia hace falta:</div>
                        <div class="mt-2"><img :src="require('Img/icon/icon_citizen.png')"> {{cost_population}}</div>
                        <div class="mt-2"><img :src="require('Img/icon/icon_gold.png')"> {{cost_gold}}</div>
                        <div class="mt-2"><img :src="require('Img/icon/icon_wood.png')"> {{cost_wood}}</div>
                    </div>
                </div>
            </div>
            <InformeTransporte btnTitle='¡Fundar una colonia!' :call='fundar' :objetivo='info.name' :size='cost_wood'></InformeTransporte>
        </div>
        </Ventana1>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import $store from 'Stores/store'
import $city from 'Stores/city'
import $config from 'Stores/config'
import $resources from 'Stores/resources'
import $movement from 'Stores/movement'
import InformeTransporte from 'Components/modal/IslaCiudad/Componentes/InformeTransporte.vue'

export default {
    props:['info','close'],
    components:{
        Ventana1,
        InformeTransporte
    },
    data(){
        return {
            gold:9000,
            population:40
        }
    },
    methods:{
        fundar(){
            axios.post("movement/colonize/" + this.city_id, {
                island: this.info.id,
                position: this.info.position
            })
            .then(res => {
                if(res.data=='ok'){
                    this.close()
                    $store.commit('reloadIslandData')
                    $resources.commit('removeApoint')
                    $resources.commit('colonize',{gold:this.cost_gold,ships:this.getShips()})
                    $resources.commit('removeResources',{wood:this.cost_wood})
                    $resources.commit('reducePopulation',{population:this.cost_population})
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
        city_id() {
            return $city.state.city_id;
        },
        cost_gold(){
            return $config.state.world.colonize.gold;
        },
        cost_wood(){
            return $config.state.world.colonize.wood;
        },
        cost_population(){
            return $config.state.world.colonize.population;
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "~Sass/modal";

    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    .requisitos{
        display: inline-block;
        background-color: #fffbec;
        border: 1px solid #fbe7c0;
        padding: 18px 50px;
        text-align: center;
    }
</style>
