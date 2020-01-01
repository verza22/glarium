<template>
    <div class="px-5">
        <div class="celda" v-for='i in resources' :key='i'>
            <div class="flex-4 celda mr-3">
                <div class="mr-3"><img :src="require('Img/icon/'+geticon(i))"></div>
                <div class="flex-1"><vue-slider :change='cambiar()' :disabled='getDisable(i)' :ref="'slider_'+(i)" :height='16' silent :max='getMax(i)' v-model="values[i]"></vue-slider></div>
            </div>
            <div class="flex-2">2</div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import $resources from 'Stores/resources'
import $config from 'Stores/config'

export default {
    name:'MoverRecursos',
    props:['changeSize'],
    components:{
        VueSlider
    },
    data(){
        return {
            resources:[0,1,2,3,4],
            values:[0,0,0,0,0],
        }
    },
    methods:{
        geticon(i){
            switch(i){
                case 0:
                    return 'icon_wood.png';
                break;
                case 1:
                    return 'icon_wine.png';
                break;
                case 2:
                    return 'icon_marble.png';
                break;
                case 3:
                    return 'icon_glass.png';
                break;
                case 4:
                    return 'icon_sulfur.png';
                break;
            }
        },
        getDisable(i){
            switch(i){
                case 0:
                    return this.wood==0||this.getMax(i)==0;
                break;
                case 1:
                    return this.wine==0||this.getMax(i)==0;
                break;
                case 2:
                    return this.marble==0||this.getMax(i)==0;
                break;
                case 3:
                    return this.glass==0||this.getMax(i)==0;
                break;
                case 4:
                    return this.sulfur==0||this.getMax(i)==0;
                break;
            }
        },
        getMax(i){
            switch(i){
                case 0:
                    return this.wood>(this.values[i]+this.free_space) ? (this.values[i]+this.free_space) : this.wood;
                break;
                case 1:
                    return this.wine>(this.values[i]+this.free_space) ? (this.values[i]+this.free_space) : this.wine;
                break;
                case 2:
                    return this.marble>(this.values[i]+this.free_space) ? (this.values[i]+this.free_space) : this.marble;
                break;
                case 3:
                    return this.glass>(this.values[i]+this.free_space) ? (this.values[i]+this.free_space) : this.glass;
                break;
                case 4:
                    return this.sulfur>(this.values[i]+this.free_space) ? (this.values[i]+this.free_space) : this.sulfur;
                break;
            }
        },
        cambiar(){
            this.changeSize(this.size)
        }
    },
    computed:{
        size(){
            return this.values.reduce((a, b) => a + b, 0)
        },
        free_space(){
            return (this.ship_available*this.transport)-this.size;
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
        transport(){
            return $config.state.world.transport;
        },
        ship_available(){
            return $resources.state.userResources.trade_ship_available;
        },
    }
}
</script>

<style lang="scss" scoped>
    .celda{
        height: 35px;
        align-items: center;
        display: flex;
    }
</style>
