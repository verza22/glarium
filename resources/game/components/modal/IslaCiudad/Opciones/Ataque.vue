<template>
    <div class="box">
        <p>Otras ciudades pueden tener tesoros que estarían mejor guardados en nuestro depósito. Ten en cuenta que las unidades que se encuentren fuera de tu ciudad pagan doble manutención. Entonces piénsalo bien cuando quieras enviar a tus tropas a saquear.</p>
        <div class="gtitle text-center mb-3">Enviar ejército</div>
        <p>Comandas a tus tropas de Polis saquear la ciudad Vino 2.¡Recuerda mantener el puerto de la ciudad que piensas atacar libre de barcos enemigos con un bloqueo, sino tus tropas podrían ser tomadas prisioneras por los barcos mercantes!</p>
        <div class="px-3">
            <div v-for="(unit,i) in units" :key="i">
                <div class="d-flex">
                    <div class="d-flex flex-1 align-items-center">
                        <div class="mx-2">{{unit.cant}}</div>
                        <div class="unit mx-1" :class="'unit_'+unit.unit_id"></div>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="number" @change='validateCant(unit)' v-model="unit.cant_aux" />
                    </div>
                </div>
            </div>
        </div>
        <InformeTransporte :isChangeShip="true" :changeShip="changeShip" btnTitle='¡Saquear!' :call='enviar' :objetivo='data.city.name' :size='size'></InformeTransporte>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import InformeTransporte from 'Components/modal/IslaCiudad/Componentes/InformeTransporte.vue'
import $city from 'Stores/city'
import $unit from 'Stores/unit'
import $movement from 'Stores/movement'

export default {
    name: 'Ataque',
    props:['data','changeType'],
    components:{
        InformeTransporte
    },
    data(){
        return {
            size:0,
            units:0,
            ships:0
        }
    },
    methods:{
        changeShip(ships){
            this.ships = ships
        },
        validateCant(unit){
            if(unit.cant_aux<0){
                unit.cant_aux = 0;
            }

            if(unit.cant_aux>unit.cant){
                unit.cant_aux = unit.cant;
            }

            this.calculateSize();
        },
        calculateSize(){
            //Calculamos el tamaño de todas las unidades
            var units = this.units.map(unit => unit.cant_aux*unit.size)
            this.size = units.reduce((a,b) => a+b)
        },
        enviar(){
            var unidades = this.units.filter(unit =>{return unit.cant_aux>0})
            var units = unidades.map(unit =>{return unit.unit_id})
            var cants = unidades.map(unit =>{return parseInt(unit.cant_aux)})
            axios.post("attack/" + this.data.city.city_id, {
                city_from: this.city_from,
                units:units,
                cants:cants,
                trade_ship:this.ships
            })
            .then(res => {
                if(res.data=='ok'){
                    this.changeType(0)
                    $movement.dispatch('updateMovemenet')
                    $notification.commit('show',{advisor:2,type:true});
                }else{
                    $notification.commit('show',{advisor:2,type:false,message:res.data});
                }
            })
            .catch(err => {
                $notification.commit('show',{advisor:2,type:false,message:err});
            });
        }
    },
    computed:{
        city_from(){
            return $city.state.city_id;
        },
        units_aux(){
            var units = $unit.getters.getUnits(this.city_from);
            return units.map(item =>{
                return {...item,cant_aux:0}
            })
        }
    },
    mounted(){
        this.units = this.units_aux
    }
}
</script>

<style lang="scss" scoped>
@import '~Sass/units';
.box{
    font-size: 0.83rem;
    line-height: 0.83rem;
}
</style>
