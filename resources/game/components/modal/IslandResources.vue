<template>
    <div class="box pb-5">
        <div class="text-justify mb-3 texto">{{$t('island.forestTitle')}}</div>
        <div class="gtitle text-center">{{$t('island.workers')}}</div>
        <div class="d-flex">
            <div class="flex-1 citizen">
                <img class="mb-2" :src="require('Img/island/citizen.png')">
                <div class="valores">0</div>
            </div>
            <div class="flex-3">
                <div class="d-flex">
                    <div class="flex-1 min" @click='setMin'></div>
                    <div class="flex-10"><vue-slider ref="slider" :height='16' :max='max' v-model="value"></vue-slider></div>
                    <div class="flex-1 max" @click='setMax'></div>
                </div>
            </div>
            <div class="flex-1 workers">
                <img class="mb-2" :src="require('Img/island/worker.png')">
                <div class="valores">0</div>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
    name:'IslandResources',
    components: {
        VueSlider
    },
    data(){
        return {
            value:30,
            max:60
        }
    },
    methods:{
        setMin(){
            this.$refs.slider.setValue(0)
        },
        setMax(){
            this.$refs.slider.setValue(this.max)
        },
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
</style>
<style>
    .vue-slider-process {
        background-color: #dead69;
    }
    .vue-slider-dot-tooltip-inner {
        border-color: #ddad6b;
        background-color: #dcad5d;
    }
</style>