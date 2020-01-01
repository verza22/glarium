<template>
    <div class="px-5">
        <div class="celda" v-for='i in resources' :key='i'>
            <div class="flex-4 celda mr-3">
                <div class="mr-3"><img :src="require('Img/icon/'+geticon(i))"></div>
                <div class="flex-1"><vue-slider v-on:change='cambiar($event,i)' :disabled='getDisable(i)' :ref="'slider_'+(i)" :height='16' silent :max='getMax(i)' v-model="values[i]"></vue-slider></div>
            </div>
            <div class="flex-2 d-flex">
                <div class="flex-1">
                    <div class="btnGeneral" title="Minimo" @click='minimo(i)'>-</div>
                </div>
                <div class="flex-1">
                    <div class="btnGeneral" title="Maximo" @click='maximo(i)'>+</div>
                </div>
                <div class="flex-2 m-auto"><input size='6' type="text" :id="'input_'+i" v-on:keyup='cambiarI($event,i)' v-model='values2[i]' maxlength='9'></div>
            </div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import $resources from 'Stores/resources'
import $config from 'Stores/config'

export default {
    name:'MoverRecursos',
    props:['changeSize','values'],
    components:{
        VueSlider
    },
    data(){
        return {
            resources:[0,1,2,3,4],
            values2:[0,0,0,0,0],
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
            var value = parseInt(this.values[i]);
            switch(i){
                case 0:
                    if(this.max_size>this.wood)return this.wood;
                break;
                case 1:
                    if(this.max_size>this.wine)return this.wine;
                break;
                case 2:
                    if(this.max_size>this.marble)return this.marble;
                break;
                case 3:
                    if(this.max_size>this.glass)return this.glass;
                break;
                case 4:
                    if(this.max_size>this.sulfur)return this.sulfur;
                break;
            }
            if(this.free_space==0){
                return value-(value-(this.max_size-this.otherSum(i)))
            }else{
                return value+this.free_space;
            }
        },
        cambiar(e,i){
            this.values2[i] = e
            this.changeSize(this.size)
        },
        otherSum(j){
            var n = 0
            for(var i=0;i<this.values.length;i++){
                if(i!=j){
                    n += parseInt(this.values[i])
                }
            }
            return n
        },
        cambiarI(e,i){
            e.stopPropagation()
            var input = document.getElementById('input_'+i)
            var n = parseInt(input.value)
            n = isNaN(n) ? 0 :n
            n = n<0 ? 0 : n
            this.values2[i] = n
            this.values[i] = n
            this.$refs['slider_'+i][0].setValue(n)
            input.value = n
        },
        minimo(i){
            var n =  this.values[i] - 500;
            n = n<0 ? 0 : n
            this.values2[i] = n
            this.values[i] = n
            this.$refs['slider_'+i][0].setValue(n)
        },
        maximo(i){
            var n =  this.values[i] + 500;
            this.values2[i] = n
            this.values[i] = n
            this.$refs['slider_'+i][0].setValue(n)
        }
    },
    computed:{
        size(){
            var suma = this.values.reduce((a, b) => parseInt(a) + parseInt(b), 0)
            return suma>this.max_size ? this.max_size : suma
        },
        max_size(){
            return (this.ship_available*this.transport);
        },
        free_space(){
            var free = (this.ship_available*this.transport)-this.size;
            free = free<0 ? 0 : free;
            return free;
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
    },
    watch:{
        values(){
            for(var i=0;i<this.values.length;i++){
                var value = parseInt(this.values[i]);
                if(isNaN(value)){
                    this.values[i] = 0
                    this.$refs['slider_'+i][0].setValue(0)
                }else{
                    var max = this.getMax(i);
                    if(value>max&&max>=0){
                        this.values[i] = max
                        this.values2[i] = max
                        this.$refs['slider_'+i][0].setValue(max)
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .celda{
        height: 35px;
        align-items: center;
        display: flex;
    }
    .btnGeneral{
        display: inline-block;
        padding: 6px 15px;
    }
</style>
