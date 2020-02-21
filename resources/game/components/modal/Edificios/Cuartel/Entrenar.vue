<template>
    <div>
        <div class="gtitle text-center mb-3">Unidades programadas para entrenar</div>
        <div class="text-danger nounit" v-if="unitTotal.population<1">No se han seleccionado unidades</div>
        <div v-else  class="d-flex">
            <div v-for="(unit,i) in units" :key="i">
                <div v-if="unit.trainer>0">
                    <div><div class="unit mx-1" :class="'unit_'+unit.id"></div></div>
                    <div class="text-center">{{unit.trainer}}</div>
                </div>
            </div>
        </div>
        <hr class="hred">
        <div class="d-flex align-items-center">
            <Recursos class="flex-1" :disabled='true' :unit='unitTotal'/>
            <div>
                <div class="btnGeneral py-2 px-3" @click="entrenar()" :class="unitTotal.population<1 ? 'opacity-5' : ''">Entrenar</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Recursos from 'Components/modal/Edificios/Cuartel/Recursos.vue'
import $city from 'Stores/city'
import $notification from 'Stores/notification'
import $resources from 'Stores/resources'
import $unit from 'Stores/unit'

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
        entrenar(){
            if(this.unitTotal.population==0){
                return
            }
            var unidades = this.units.filter(unit =>{return unit.trainer>0})
            var units = unidades.map(unit =>{return unit.id})
            var cants = unidades.map(unit =>{return parseInt(unit.trainer)})
            axios.post('unit/'+this.city_id,{
                units:units,
                cants:cants
            })
            .then(res =>{
                if(res.data!='ok'){
                    $notification.commit('show',{advisor:2,type:false,message:res.data});
                }else{
                    $notification.commit('show',{advisor:2,type:true});
                    $resources.commit('reducePopulation',{population:this.unitTotal.population})
                    $resources.commit('removeResources',{
                        wood:this.unitTotal.wood,
                        wine:this.unitTotal.wine,
                        glass:this.unitTotal.glass,
                        sulfur:this.unitTotal.sulfur
                    });
                    $unit.dispatch('updateUnit')
                    this.clear();
                    this.clearUnits();
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:2,type:false,message:err});
            })
        },
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
        },
        clearUnits(){
            this.units.forEach(unit=>{
                unit.trainer=0;
            })
        }
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        },
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
    @import '~Sass/units';
    .nounit{
        height: 54px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
