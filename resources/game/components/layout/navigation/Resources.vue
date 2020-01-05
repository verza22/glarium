<template>
    <div class="flex-1 d-flex resources">
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.wood')">
                <img class="mr-1" :src="require('Img/icon/icon_wood.png')">
                <span>{{$money(wood)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.wine')">
                <img class="mr-1" :src="require('Img/icon/icon_wine.png')">
                <span>{{$money(wine)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.marble')">
                <img class="mr-1" :src="require('Img/icon/icon_marble.png')">
                <span>{{$money(marble)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.glass')">
                <img class="mr-1" :src="require('Img/icon/icon_glass.png')">
                <span>{{$money(glass)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.sulfur')">
                <img class="mr-1" :src="require('Img/icon/icon_sulfur.png')">
                <span>{{$money(sulfur)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $city from 'Stores/city'
import $resources from 'Stores/resources'
import $config from 'Stores/config'
import $building from 'Stores/building'

export default {
    name:'Resources',
    data(){
        return {
            resources:{}
        }
    },
    methods:{
        getResources(){
            axios("city/getResources/" + this.city_id)
            .then(res => {
                //this.resources = res.data;
                $resources.commit('updateResources',res.data);
            })
        },
        setProducirRecursos(){
            //Se encarga de producir recursos cada segundo
            setInterval(this.producirRecursos, 1000);
        },
        producirRecursos(){
            //Calculamos la produccion de madera
            var woodProducer = (this.worker_forest * (1+((this.producerWoodLevel*2)/100)) * this.bonus_resources) / 3600;
            if(this.wood>=this.maxCapacity){
                woodProducer = 0;
            }
            var minerProducer = (this.worker_mine * (1+((this.producerMinerLevel*2)/100)) * this.bonus_resources) / 3600;
            var minerResource = this.getMinerResource()

            if(minerResource>=this.maxCapacity){
                minerProducer = 0;
            }
            if(woodProducer!=0||minerProducer!=0||this.tavernConsume>0){
                var minerObj = this.setMinerProducer(minerProducer*this.corruption);
                var obj = {
                    ...minerObj,
                    wood:woodProducer*this.corruption
                }
                //Calculo del consumo de vino
                if(this.tavernConsume>0){
                    if(this.island_type!=1){
                        obj = {
                            ...obj,
                            wine:-this.tavernConsume
                        }
                    }else{
                        obj.wine -= this.tavernConsume
                    }
                }
                if(this.wine < 0){
                    //Se cabao el vino
                    obj.wine = 0;
                    $resources.commit('updateWine',{wine:0})
                    $resources.commit('setWineTavern',{wine:0})
                    axios.post('city/setWine/'+this.city_id,{
                        wine:0
                    })
                }
                $resources.commit('produceResources',obj)
            }
        },
        getMinerResource(){
            switch(this.island_type){
                case 1:
                    return this.wine;
                break;
                case 2:
                    return this.marble;
                break;
                case 3:
                    return this.glass;
                break;
                case 4:
                    return this.sulfur;
                break;
            }
        },
        setMinerProducer(minerProducer){
            switch(this.island_type){
                case 1:
                    return {wine:minerProducer};
                break;
                case 2:
                    return {marble:minerProducer};
                break;
                case 3:
                    return {glass:minerProducer};
                break;
                case 4:
                    return {sulfur:minerProducer};
                break;
            }
        }
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        },
        corruption(){
            return 1 - $city.getters.getCorruption;
        },
        wood(){
            return $resources.state.wood;
        },
        wine(){
            return $resources.state.wine;
        },
        marble(){
            return $resources.state.marble;
        },
        glass(){
            return $resources.state.glass;
        },
        sulfur(){
            return $resources.state.sulfur;
        },
        island_type(){
            return $city.state.city.type;
        },
        worker_forest(){
            return $resources.state.population.worker_forest;
        },
        worker_mine(){
            return $resources.state.population.worker_mine;
        },
        producerWoodLevel(){
            return $building.getters.getBuildingLevel(11);
        },
        producerMinerLevel(){
            return $building.getters.getProducerLevel(this.island_type);
        },
        depositLevel(){
            return $building.getters.getBuildingLevel(3);
        },
        bonus_resources(){
            return $config.state.world.bonus.resources;
        },
        maxCapacity(){
            return ($config.state.world.warehouse.capacity * this.depositLevel) + $config.state.world.warehouse.capacity_base;
        },
        tavernConsume(){
            return (($resources.getters.tavernConsume*(1-($building.getters.getBuildingLevel(9)*0.01)))/3600);
        }
    },
    watch:{
        city_id(newval){
            this.getResources()
        }
    },
    mounted(){
        this.setProducirRecursos();
    }
}
</script>

<style lang="scss" scoped>
.resources{
    padding-left: 5px;
    user-select: none;
}
</style>
