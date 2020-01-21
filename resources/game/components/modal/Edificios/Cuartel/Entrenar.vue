<template>
    <div>
        <div class="gtitle text-center mb-3">Unidades programadas para entrenar</div>
        <div class="text-danger text-center">No se han seleccionado unidades</div>
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
