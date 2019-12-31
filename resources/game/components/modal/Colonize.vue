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
            <div class="gtitle text-center mt-4">Ver informe</div>
            <div class="d-flex">
                <div class="flex-1 d-flex justify-content-center">
                    <div><img class="ship" :src="require('Img/icon/ship_transport.png')"></div>
                    <div class="mb-auto mt-auto">{{getShips()}}/{{ship_available}}</div>
                </div>
                <div class="flex-1 d-flex align-items-center justify-content-center">
                    <div class="mr-2"><img :src="require('Img/icon/icon_journeytime.png')"></div>
                    <div>
                        <div>Tiempo de carga: {{tiempo_carga()}}</div>
                        <div>Tiempo de viaje: {{distance}}</div>
                    </div>
                </div>
                <div class="flex-1 d-flex align-items-center justify-content-center">
                    <div class="mr-2"><img :src="require('Img/icon/icon_target2.png')"></div>
                    <div>Objetivo: {{info.name}}</div>
                </div>
            </div>
            <div class="text-center mt-3">
                <div class="btnGeneral" @click='fundar()'>¡Fundar una colonia!</div>
            </div>
        </div>
        </Ventana1>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import $store from 'Stores/store'
import $config from 'Stores/config'
import $resources from 'Stores/resources'
import $building from 'Stores/building'

export default {
    props:['info','close'],
    components:{
        Ventana1
    },
    data(){
        return {
            gold:9000,
            population:40
        }
    },
    methods:{
        getShips(){
            return Math.ceil(this.cost_wood/this.transport)
        },
        tiempo_carga(){
            var speed = (this.load_speed_base + (this.load_speed * this.port_level))/60
            return this.$sectotime(Math.ceil(this.cost_wood/speed));
        },
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
            return $store.state.city_id;
        },
        ship_available(){
            return $resources.state.userResources.trade_ship_available;
        },
        distance(){
            return this.$sectotime($config.state.world.distance.same_island);
        },
        load_speed_base(){
            return $config.state.world.load_speed_base;
        },
        load_speed(){
            return $config.state.world.load_speed;
        },
        port_level(){
            return $building.getters.getBuildingLevel(16)
        },
        cost_gold(){
            return $config.state.world.colonize.gold;
        },
        cost_wood(){
            return $config.state.world.colonize.wood;
        },
        cost_population(){
            return $config.state.world.colonize.population;
        },
        transport(){
            return $config.state.world.transport;
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
    .ship{
        max-width: 60px;
    }
    .btnGeneral{
        display: inline-block;
        padding: 10px 20px;
    }
</style>
