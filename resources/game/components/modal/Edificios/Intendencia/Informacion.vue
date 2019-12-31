<template>
    <div class="d-flex my-3">
        <div class="flex-1 text-center">
            <img :src="require('Img/island/citizen.png')">
        </div>
        <div class="flex-3 d-flex justify-content-center">
            <div>
                <div><img :src="require('Img/icon/livingspace.png')"> Espacio habitable: {{$money(population_now)}}/{{population_max}}</div>
                <div><img :src="require('Img/icon/action_point.png')"> Puntos de acción: {{apoint}}/{{apoint_max}}</div>
            </div>
        </div>
        <div class="flex-3 d-flex justify-content-center">
            <div>
                <div><img :src="require('Img/icon/growth_positive.png')"> Crecimiento: {{$money_two(population_produce)}} Por hora</div>
                <div><img :src="require('Img/icon/income_positive.png')"> Oro total: {{$money((population*3)-(scientists*scientist_cost))}}</div>
                <div><img :src="require('Img/icon/corruption.png')"> Corrupción: {{$money_two(corruption)}}%</div>
            </div>
        </div>
        <div class="flex-2 text-center">
             <img :src="require('Img/icon/happy.png')">
             <div class="mt-2">Feliz</div>
        </div>
    </div>
</template>

<script>
import $resources from 'Stores/resources'
import $config from 'Stores/config'
import $store from 'Stores/store'

export default {
    name:'Informacion',
    computed:{
        corruption(){
            return $store.getters.getCorruption * 100;
        },
        population_max(){
            return $resources.state.population.population_max;
        },
        population_now(){
            return $resources.state.population.population_now;
        },
        population(){
            return Math.floor($resources.state.population.population);
        },
        scientists(){
            return $resources.state.population.scientists;
        },
        scientist_cost(){
            return $config.getters.scientists_cost;
        },
        apoint(){
            return $resources.state.apoint;
        },
        apoint_max(){
            return $resources.state.apoint_max;
        },
        population_produce(){
            return (($resources.getters.bonuses-$resources.getters.debuff)*0.02);
        }
    }
}
</script>
