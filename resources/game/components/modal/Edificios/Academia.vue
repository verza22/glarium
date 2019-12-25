<template>
    <div class="box mb-3">
        <div class="gtitle text-center">{{$t('island.workers')}}</div>
        <div class="d-flex mt-3">
            <div class="flex-1 citizen">
                <img class="mb-2" :src="require('Img/island/citizen.png')">
                <div class="valores">{{population_available}}</div>
            </div>
            <div class="flex-3">
                <div class="d-flex texto">
                    <div class="flex-1">
                        <div>{{$t('other.income')}}: </div>
                        <div>{{population_available*3}} <img :src="require('Img/icon/icon_gold.png')"> {{$t('other.perHour')}}</div>
                    </div>
                    <div class="flex-1 text-right">
                        <div>{{$t('other.production')}}: </div>
                        <div>{{value}} <img :src="require('Img/icon/icon_pi.png')"> {{$t('other.perHour')}}</div>
                    </div>
                </div>
                <div class="d-flex my-3">
                    <div class="flex-1 min" @click='setMin'></div>
                    <div class="flex-10"><vue-slider ref="slider" :height='16' silent :max='max' v-model="value"></vue-slider></div>
                    <div class="flex-1 max" @click='setMax'></div>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="campo">
                        <input class="w-100" type="number" v-model="value">
                    </div>
                    <div class="btnGeneral px-3 ml-3 d-flex">
                        <div class="m-auto" @click='confirmar'>{{$t('other.confirm')}}</div>
                    </div>
                </div>
            </div>
            <div class="flex-1 workers">
                <img class="mb-2" :src="require('Img/icon/scientist.png')">
                <div class="valores">{{value}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import VueTableDynamic from 'vue-table-dynamic'
import 'vue-slider-component/theme/default.css'
import {catchAxios} from 'Js/util.js'
import $resources from 'Stores/resources'
import $store from 'Stores/store'
import Swal from 'sweetalert2'

export default {
    name:'Academia',
    props:['data'],
    components: {
        VueSlider,
        VueTableDynamic 
    },
    data(){
        return {
            value:0,
            population:0,
            max:30,
            workers:0,
        }
    },
    methods:{
        setMin(){
            this.$refs.slider.setValue(0)
        },
        setMax(){
            this.$refs.slider.setValue(this.max)
        },
        confirmar(){
            axios.post('city/setScientists/'+this.city_id,{
                scientists:this.value
            })
            .then(res =>{
                Swal.fire('Exito','Trabajadores cambiados','success')
                $resources.commit('setScientists',{population:this.population_available,scientists:this.value})
            })
            .catch(err =>{
                catchAxios(err)
            })
        },
        initData(){
            this.workers = this.scientists;
            this.population = this.population_aux + this.workers;
            this.max = this.scientists_max>this.population ? this.population : this.scientists_max;
            this.value = this.workers;
        },
    },
    computed:{
        population_available(){
            return this.population - this.value;
        },
        population_aux(){
            return this.$floor($resources.state.population.population);
        },
        scientists_max(){
            return this.$floor($resources.state.population.scientists_max);
        },
        scientists(){
            return this.$floor($resources.state.population.scientists);
        },
        city_id(){
            return $store.state.city_id;
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
        },
        data(newval,oldval){
            if(newval.info.level!=oldval.info.level){
                this.initData()
            }
        }
    },
    mounted(){
        this.initData()
    }
}
</script>

<style lang="scss" scoped>
    .citizen,.workers{
        position: relative;
        display: flex;
        justify-content: center;
        align-self: flex-start;
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