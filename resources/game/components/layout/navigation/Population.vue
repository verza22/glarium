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
        tavern_wine_max(){
            return $resources.state.population.wine_max;
        },
        tavern_wine(){
            return $resources.state.population.wine;
        }
    },
    watch:{
        city_id(newval){
            this.getPopulation()
        }
    },
    mounted(){
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
