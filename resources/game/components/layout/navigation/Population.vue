<template>
    <div class="flex-2 d-flex box" :title="$t('resources.population')">
        <div class="population"></div>
        <div>{{$floor(population)}} ({{$floor(population_now)}})</div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'
import $resources from 'Stores/resources'

export default {
    name:'Population',
    methods:{
        getPopulation(){
            $resources.commit('reloadPopulation');
        },
        setProducirPoblacion(){
            //Se encarga de producir pobladores cada segundo
            setInterval(this.producirPoblacion, 1000);
        },
        producirPoblacion(){
            var increasePopulation = (((this.bonuses-this.debuff)*0.02)/3600);
            if(this.population_now+increasePopulation < this.population_max){
                $resources.commit('increasePopulation',{increasePopulation:increasePopulation})
            }
        }
    },
    computed:{
        city_id(){
            return $store.state.city_id;
        },
        population(){
            return $resources.state.population.population;
        },
        population_now(){
            return $resources.state.population.population_now;
        },
        population_max(){
            return $resources.state.population.population_max;
        },
        tavern_wine_max(){
            return $resources.state.population.wine_max;
        },
        tavern_wine(){
            return $resources.state.population.wine;
        },
        bonuses(){
            return $resources.getters.bonuses;
        },
        debuff(){
            return $resources.getters.debuff;
        }
    },
    watch:{
        city_id(newval){
            this.getPopulation()
        }
    },
    mounted(){
        this.setProducirPoblacion();
        $store.subscribe(action => {
            if (action.type === 'reloadPopulation') {
                this.getPopulation();
            }
        });
    }
}
</script>

<style lang="scss" scoped>
.population{
    background-image: url('~Img/icon/population.png');
    width: 35px;
    height: 23px;
    margin-right: 5px;
}
.box{
    user-select: none;
    justify-content: center;
    align-items: center;
}
</style>
