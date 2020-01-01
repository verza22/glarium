<template>
    <div>
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
                <div>Objetivo: {{objetivo}}</div>
            </div>
        </div>
        <div class="text-center mt-3">
            <div class="btnGeneral" @click='call()'>{{btnTitle}}</div>
        </div>
    </div>
</template>

<script>
import $resources from 'Stores/resources'
import $config from 'Stores/config'
import $building from 'Stores/building'

export default {
    name:'InformeTransporte',
    props:['objetivo','size','call','btnTitle'],
    methods:{
        getShips(){
            return Math.ceil(this.size/this.transport)
        },
        tiempo_carga(){
            var speed = (this.load_speed_base + (this.load_speed * this.port_level))/60
            return this.$sectotime(Math.ceil(this.size/speed));
        },
    },
    computed:{
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
        transport(){
            return $config.state.world.transport;
        }
    }
}
</script>

<style lang="scss" scoped>
    .ship{
        max-width: 60px;
    }
    .btnGeneral{
        display: inline-block;
        padding: 10px 20px;
    }
</style>
