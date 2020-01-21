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
            var trainer_aux = 0;
            trainer_aux = Math.floor((this.population-(this.sum('population')-(unit.trainer*unit.population)))/unit.population);

            var trainer_wood   = unit.wood   == 0 ? -1 : Math.floor((this.wood-(this.sum('wood')-(unit.trainer*unit.wood)))/unit.wood)
            var trainer_wine   = unit.wine   == 0 ? -1 : Math.floor((this.wine-(this.sum('wine')-(unit.trainer*unit.wine)))/unit.wine)
            var trainer_glass  = unit.glass  == 0 ? -1 : Math.floor((this.glass-(this.sum('glass')-(unit.trainer*unit.glass)))/unit.glass)
            var trainer_sulfur = unit.sulfur == 0 ? -1 : Math.floor((this.sulfur-(this.sum('sulfur')-(unit.trainer*unit.sulfur)))/unit.sulfur)

            trainer_aux = trainer_wood<trainer_aux&&trainer_wood>-1 ? trainer_wood : trainer_aux
            trainer_aux = trainer_wine<trainer_aux&&trainer_wine>-1 ? trainer_wine : trainer_aux
            trainer_aux = trainer_glass<trainer_aux&&trainer_glass>-1 ? trainer_glass : trainer_aux
            trainer_aux = trainer_sulfur<trainer_aux&&trainer_sulfur>-1 ? trainer_sulfur : trainer_aux

            unit.trainer = trainer_aux
        },
        validateTrainer(unit){
            if(unit.trainer<0){
                unit.trainer = 0;
                return;
            }

            var trainer_aux = -1;
            if(this.sum('population')>this.population){
                trainer_aux = Math.floor((this.population-(this.sum('population')-(unit.trainer*unit.population)))/unit.population);
            }
            if(this.sum('wood')>this.wood){
                var trainer_wood   = unit.wood   == 0 ? -1 : Math.floor((this.wood-(this.sum('wood')-(unit.trainer*unit.wood)))/unit.wood)
                trainer_aux = ((trainer_wood<trainer_aux)||trainer_aux==-1)&&trainer_wood>-1 ? trainer_wood : trainer_aux
            }
            if(this.sum('wine')>this.wine){
                var trainer_wine   = unit.wine   == 0 ? -1 : Math.floor((this.wine-(this.sum('wine')-(unit.trainer*unit.wine)))/unit.wine)
                trainer_aux = ((trainer_wine<trainer_aux)||trainer_aux==-1)&&trainer_wine>-1 ? trainer_wine : trainer_aux
            }
            if(this.sum('glass')>this.glass){
                var trainer_glass  = unit.glass  == 0 ? -1 : Math.floor((this.glass-(this.sum('glass')-(unit.trainer*unit.glass)))/unit.glass)
                trainer_aux = ((trainer_glass<trainer_aux)||trainer_aux==-1)&&trainer_glass>-1 ? trainer_glass : trainer_aux
            }
            if(this.sum('sulfur')>this.sulfur){
                var trainer_sulfur = unit.sulfur == 0 ? -1 : Math.floor((this.sulfur-(this.sum('sulfur')-(unit.trainer*unit.sulfur)))/unit.sulfur)
                trainer_aux = ((trainer_sulfur<trainer_aux)||trainer_aux==-1)&&trainer_sulfur>-1 ? trainer_sulfur : trainer_aux
            }
            if(trainer_aux>=0){
                unit.trainer = trainer_aux;
            }
        },
        sum(prop){
            var total = 0
            for ( var i = 0, _len = this.units.length; i < _len; i++ ) {
                total += parseInt(this.units[i]['trainer']*this.units[i][prop])
            }
            return total
        }
    },
    computed:{
        population(){
            return $resources.state.population.population;
        },
        wood(){
            return $resources.state.wood;
        },
        wine(){
            return $resources.state.wine;
        },
        glass(){
            return $resources.state.glass;
        },
        sulfur(){
            return $resources.state.sulfur;
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
