<template>
    <div class="box">
        <div class="text-justify mb-3 texto">{{getTitle()}}</div>
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
                        <div>{{value}} <img :src="getIcon()"> {{$t('other.perHour')}}</div>
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
                <img class="mb-2" :src="getWorkerIcon()">
                <div class="valores">{{value}}</div>
            </div>
        </div>
         <div>
            <div class="gtitle mt-5 mb-3 text-center">{{$t('island.islandCities')}}</div>
            <vue-table-dynamic :params="params"></vue-table-dynamic>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import VueTableDynamic from 'vue-table-dynamic'
import 'vue-slider-component/theme/default.css'
import $resources from 'Stores/resources'
import $store from 'Stores/store'
import $notification from 'Stores/notification'

export default {
    name:'IslandResources',
    props:['data'],
    components: {
        VueSlider,
        VueTableDynamic
    },
    data(){
        return {
            value:0,
            population:0,
            max:0,
            workers:0,
            params: {
                data: [],
                header: 'row',
                sort: [0,1,2,3,4]
            }
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
            axios.post('island/setWorker/'+this.city_id,{
                type:this.data.info.type,
                workers:this.value
            })
            .then(res =>{
                if(res.data=='ok'){
                    $notification.commit('show',{advisor:1,type:true});
                    if(this.data.info.type === 1){
                        $resources.commit('setWorkerForest',{population:this.population_available,worker_forest:this.value})
                    }else{
                        $resources.commit('setWorkerMine',{population:this.population_available,worker_mine:this.value})
                    }
                }else{
                    $notification.commit('show',{advisor:1,type:false,message:res.data});
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:1,type:false,message:err});
            })
        },
        iniData(){
            this.workers = this.data.info.type === 1 ? this.worker_forest : this.worker_mine;
            this.population = this.population_aux + this.workers;
            this.max = this.data.info.workers>this.population ? this.population : this.data.info.workers;
            this.value = this.workers;
            this.params.data = [];
            this.params.data.push(this.$t('island.donationTable'));
            this.params.data.push(...this.data.donations);
        },
        getTitle(){
            if(this.data.info.type==1){
                return this.$t('island.forestTitle');
            }else{
                switch(this.data.info.island_type){
                    case 1:
                        return this.$t('island.vinesTitle');
                    break;
                    case 2:
                        return this.$t('island.quarryTitle');
                    break;
                    case 3:
                        return this.$t('island.crystalTitle');
                    break;
                    case 4:
                        return this.$t('island.sulfurTitle');
                    break;
                }
            }
        },
        getIcon(){
            if(this.data.info.type==1){
                return require('Img/icon/icon_wood.png');
            }else{
                switch(this.data.info.island_type){
                    case 1:
                        return require('Img/icon/icon_wine.png');
                    break;
                    case 2:
                        return require('Img/icon/icon_marble.png');
                    break;
                    case 3:
                        return require('Img/icon/icon_glass.png');
                    break;
                    case 4:
                        return require('Img/icon/icon_sulfur.png');
                    break;
                }
            }
        },
        getWorkerIcon(){
            if(this.data.info.type==1){
                return require('Img/island/worker.png');
            }else{
                return require('Img/island/worker_mine.png');
            }
        }
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
        },
        worker_mine(){
            return this.$floor($resources.state.population.worker_mine);
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
            if(newval.info.level!=oldval.info.level || newval.info.type != oldval.info.type){
                this.iniData()
            }
        }
    },
    beforeMount(){
        this.iniData()
    }
}
</script>

<style lang="scss" scoped>
    @import "~Sass/modal";
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
