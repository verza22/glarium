<template>
    <div class="box mb-3">
        <div class="gtitle text-center texto">Servir vino</div>
        <div class="mt-2">
            <div class="texto w-75 text-justify m-auto">Puedes determinar cuánto vino se servirá a tu población. Cuanto más vino ofrezcas, más contentos estarán tus ciudadanos. Cuidado: ¡Cada vez que distribuyas una cantidad más grande de vino, deberás darle una ración extra al tabernero!</div>
        </div>
        <div class="d-flex mt-3">
            <div class="flex-1 citizen">
                <img class="mb-2" :src="require('Img/icon/wine-big.png')">
            </div>
            <div class="flex-3">
                <div class="d-flex texto">
                    <div class="flex-1 text-right texto">
                        <div>+{{(((value/bonus_tavern_consume)/12)*bonus_tavern)*60}} Ciudadanos satisfechos</div>
                    </div>
                </div>
                <div class="d-flex my-3">
                    <div class="flex-1 min" @click='setMin'></div>
                    <div class="flex-10"><vue-slider :interval='12*bonus_tavern_consume' ref="slider" :height='16' silent :max='max' v-model="value"></vue-slider></div>
                    <div class="flex-1 max" @click='setMax'></div>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="campo">
                        <select v-model="value">
                            <option value="0">No hay vino</option>
                            <option :value="(i*12)*bonus_tavern_consume" v-for='i in level' :key='i'>{{(i*12)*bonus_tavern_consume}} de vino por hora</option>
                        </select>
                    </div>
                    <div class="btnGeneral px-3 ml-3 d-flex">
                        <div class="m-auto" @click='confirmar'>{{$t('other.confirm')}}</div>
                    </div>
                </div>
            </div>
            <div class="flex-1 workers">
                <img class="mb-2" :src="require('Img/icon/happy.png')">
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import $resources from 'Stores/resources'
import $store from 'Stores/store'
import $config from 'Stores/config'
import $notification from 'Stores/notification'

export default {
    name:'Taberna',
    props:['data'],
    components: {
        VueSlider,
    },
    data(){
        return {
            value:0,
            max:0,
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
            axios.post('city/setWine/'+this.city_id,{
                wine:this.value/this.bonus_tavern_consume
            })
            .then(res =>{
                if(res.data=='ok'){
                    $resources.commit('setWineTavern',{wine:this.value/this.bonus_tavern_consume})
                    $notification.commit('show',{advisor:1,type:true})
                }else{
                    $notification.commit('show',{advisor:1,type:false,message:res.data});
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:1,type:false,message:err});
            })
        },
        initData(){
            this.max = this.level * 12 * this.bonus_tavern_consume;
            this.value = this.tavern_wine * this.bonus_tavern_consume;
        },
    },
    computed:{
        city_id(){
            return $store.state.city_id;
        },
        level(){
            return this.data.level - 1;
        },
        tavern_wine(){
            return $resources.state.population.wine;
        },
        bonus_tavern(){
            return $config.state.world.bonus.tavern;
        },
        bonus_tavern_consume(){
            return $config.state.world.bonus.tavern_consume;
        }
    },
    watch:{
        data(newval,oldval){
            if(newval.level!=oldval.level){
                this.initData()
            }
        },
    },
    mounted(){
        this.initData()
    }
}
</script>

<style lang="scss" scoped>
    .texto{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
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
</style>
