<template>
    <div class="flex-2 d-flex box" :title="$t('resources.population')">
        <div class="population"></div>
        <div v-if='data.population'>{{$floor(data.population)}} ({{$floor(data.population_max)}})</div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'

export default {
    name:'Population',
    data(){
        return {
            data:{}
        }
    },
    methods:{
        getPopulation(){
            axios("city/getPopulation/" + this.city_id)
            .then(res => {
                this.data = res.data;
            })
        },
    },
    computed:{
        city_id(){
            return $store.state.city_id;
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
}
</style>