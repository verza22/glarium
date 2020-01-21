<template>
    <div>
        <div class="gtitle text-center mb-3">Formar unidades</div>
        <div v-for="(unit,index) in units" :key="index">
            <div class="d-flex celda">
                <div class="flex-1">
                    <div class="position-relative d-flex justify-content-center">
                        <img :src="require(`Img/unit/${unit.id}.png`)">
                        <div class="valores mt-2">0</div>
                    </div>
                </div>
                <div class="flex-5 box2">
                    <div class="gtitle">{{$t(`units[${unit.id}].name`)}}</div>
                    <div class="texto">{{$t(`units[${unit.id}].text`)}}</div>
                    <hr class="hred">
                    <Recursos :unit='unit'/>
                </div>
                <div class="flex-2 m-auto text-center">
                    <input type="number" value="0" @change='validateTrainer(unit)' class="caja" v-model="unit.trainer"/>
                    <div class="d-inline-block pointer link" @click="maxTrainer(unit)">max</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Recursos from 'Components/modal/Edificios/Cuartel/recursos.vue'
import $resources from 'Stores/resources'

export default {
    name:'Formar',
    props:['units'],
    components:{
        Recursos
    },
    methods:{
        maxTrainer(unit){
            unit.trainer = this.population-(this.$sum(this.units, 'trainer')-unit.trainer);
        },
        validateTrainer(unit){
            if(unit.trainer<0){
                unit.trainer = 0;
                return;
            }
            if(this.$sum(this.units,'trainer')>this.population){
                unit.trainer = this.population-(this.$sum(this.units, 'trainer')-unit.trainer);
                return;
            }
        }
    },
    computed:{
        population(){
            return $resources.state.population.population;
        },
    }
}
</script>

<style lang="scss" scoped>
    .celda{
        text-align: justify;
        margin-bottom: 30px;
    }
    .texto{
        line-height: 1rem;
        margin-top: 5px;
    }
    .box2{
        padding: 0px 20px
    }
    .valores{
        bottom: -35px;
    }
    .caja{
        max-width: 60px;
        display: inline-block;
    }
</style>
