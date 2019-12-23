<template>
    <div class="box pb-5">
        <div class="text-justify mb-3 texto">{{$t('island.forestTitle')}}</div>
        <div class="gtitle text-center">{{$t('island.workers')}}</div>
        <div class="d-flex mt-3">
            <div class="flex-1 citizen">
                <img class="mb-2" :src="require('Img/island/citizen.png')">
                <div class="valores">{{population_available}}</div>
            </div>
            <div class="flex-3">
                <div class="d-flex">
                    <div class="flex-1 min" @click='setMin'></div>
                    <div class="flex-10"><vue-slider ref="slider" :height='16' silent :max='max' v-model="value"></vue-slider></div>
                    <div class="flex-1 max" @click='setMax'></div>
                </div>
                <div class="d-flex justify-content-center mt-3">
                    <div class="campo">
                        <input class="w-100" type="number" v-model="value">
                    </div>
                    <div class="btnGeneral px-3 ml-3 d-flex">
                        <div class="m-auto">Confirmar</div>
                    </div>
                </div>
            </div>
            <div class="flex-1 workers">
                <img class="mb-2" :src="require('Img/island/worker.png')">
                <div class="valores">{{value}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
import $resources from 'Stores/resources'

export default {
    name:'IslandResources',
    props:['data'],
    components: {
        VueSlider
    },
    data(){
        return {
            value:0,
            population:0,
            max:0
        }
    },
    methods:{
        setMin(){
            this.$refs.slider.setValue(0)
        },
        setMax(){
            this.$refs.slider.setValue(this.max)
        },
    },
    computed:{
        population_available(){
            return this.population - this.value;
        },
        population_aux(){
            return this.$floor($resources.state.population.population);
        },
        worker_forest(){
            return this.$floor($resources.state.population.worker_forest);
        }
    },
    watch:{
        value(newval){
            var control = true;
            if(newval>this.max){
                this.value = this.max; 
                control = false;
            }
            if(newval<0||newval==''){
                this.value = 0; 
                control = false;
            }
            if(control)
            this.value = newval.toString().replace(/^0+/, '');
        }
    },
    mounted(){
        this.population = this.population_aux + this.worker_forest;
        this.max = this.data.info.workers>this.population ? this.population : this.data.info.workers;
        this.value = this.worker_forest;
    }
}
</script>

<style lang="scss" scoped>
    @import "~Sass/modal";
    .citizen,.workers{
        position: relative;
        display: flex;
        justify-content: center;
    }
    .min{
        background-image: url('~Img/icon/btn_min.png');
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
    }
    .max{
        background-image: url('~Img/icon/btn_max.png');
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
    }
    .campo{
        width: 75px;
    }
</style>