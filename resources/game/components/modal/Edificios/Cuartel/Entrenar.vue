<template>
    <div>
        <div class="gtitle text-center mb-3">Unidades programadas para entrenar</div>
        <div class="text-danger text-center" v-if="unitTotal.population<1">No se han seleccionado unidades</div>
        <div v-else  class="d-flex">
            <div v-for="(unit,i) in units" :key="i">
                <div v-if="unit.trainer>0">
                    <div><div class="unit mx-1" :class="'unit_'+unit.id"></div></div>
                    <div class="text-center">{{unit.trainer}}</div>
                </div>
            </div>
        </div>
        <hr class="hred">
        <div class="d-flex">
            <Recursos class="flex-1" :disabled='true' :unit='unitTotal'/>
            <div>asd</div>
        </div>
    </div>
</template>

<script>
import Recursos from 'Components/modal/Edificios/Cuartel/recursos.vue'

export default {
    name:'Entrenar',
    props:['units'],
    components:{
        Recursos
    },
    data(){
        return {
            unitTotal:{
                population:0,
                wood:0,
                wine:0,
                glass:0,
                sulfur:0,
                gold:0,
                time:0
            }
        }
    },
    methods:{
        changeTrainer(){
            this.clear();
            this.units.forEach(unit => {
                this.unitTotal.population += unit.trainer*unit.population
                this.unitTotal.wood += unit.trainer*unit.wood
                this.unitTotal.wine += unit.trainer*unit.wine
                this.unitTotal.glass += unit.trainer*unit.glass
                this.unitTotal.sulfur += unit.trainer*unit.sulfur
                this.unitTotal.gold += unit.trainer*unit.gold
                this.unitTotal.time += unit.trainer*unit.time
            });
        },
        clear(){
            this.unitTotal = {
                population:0,
                wood:0,
                wine:0,
                glass:0,
                sulfur:0,
                gold:0,
                time:0
            }
        }
    },
    watch: {
        units: {
            handler(newval) {
                this.changeTrainer()
            },
            deep: true
        }
    },
}
</script>

<style lang="scss" scoped>
    .unit{
        background-image: url('~Img/unit/units_mini.png');
        width: 36px;
        height: 35px;
    }
    .unit_1{
        background-position: -180px -36px;
    }
    .unit_2{
        background-position: 1px -36px;
    }
    .unit_3{
        background-position: -107px -36px;
    }
    .unit_4{
        background-position: -72px -36px;
    }
    .unit_5{
        background-position: -35px -36px;
    }
    .unit_6{
        background-position: -143px -36px;
    }
</style>
