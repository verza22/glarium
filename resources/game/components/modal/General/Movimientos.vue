<template>
    <div class="box">
        <table class="table text-center mb-0">
            <thead>
                <tr>
                    <th style="width:65px">Misión</th>
                    <th style="width:110px">Horario</th>
                    <th>Unidades</th>
                    <th></th>
                    <th>Origen</th>
                    <th></th>
                    <th>Destino</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(movement,index) in movements' :key='index' >
                    <td>
                        <img :src="require('Img/icon/movement/'+movement.movement_type_id+'.png')"  title="Colonizar">
                    </td>
                    <td v-html='getHorario(movement)'></td>
                    <td>{{movement.trade_ship}} Barcos</td>
                    <td>
                        <img class="bton" :src="require('Img/icon/movement/magnifySmall.png')"  title="Ver cargamento">
                    </td>
                    <td>
                        <div>{{movement.city_from.name}}</div>
                        <div>({{movement.city_from.user}})</div>
                    </td>
                    <td>
                        <img :src="require('Img/icon/movement/arrow_right_green.png')">
                    </td>
                    <td>
                        <div>{{movement.city_to.name}}</div>
                        <div>({{movement.city_to.user}})</div>
                    </td>
                    <td>
                        <div title="Retirar"><img class="bton" :src="require('Img/icon/movement/btn_abort.png')"></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'
import $store from "Stores/store";

export default {
    name: 'Movimientos',
    props:['movements'],
    methods:{
        getHorario(movement){
            var tipo = this.checkHorarioTipo(movement)
            var texto = '';
            var tiempo_aux = null;
            switch(tipo){
                case 1:
                    texto = 'Cargando'
                    tiempo_aux = movement.start_at
                break;
                case 2:
                    texto = 'En marcha'
                    tiempo_aux = movement.end_at
                break;
                case 3:
                    texto = 'Retornando'
                    tiempo_aux = movement.return_at
                break;
            }
            return `
                <div>${this.calculateTime(tiempo_aux)}</div>
                <div>(${texto})</div>
            `;
        },
        checkHorarioTipo(movement){
            if(this.checkMoment(movement.start_at)){
                return 1;
            }
            if(this.checkMoment(movement.end_at)){
                return 2;
            }
            if(this.checkMoment(movement.return_at)){
                return 3;
            }
        },
        checkMoment(time){
            return moment(time) > moment()
        },
        calculateTime(time){
            return this.$sectotime(moment.duration(moment(time).diff(moment(this.now))).asSeconds())
        }
    },
    computed:{
        now(){
            return $store.state.now;
        },
    }
}
</script>

<style lang="scss" scoped>
    .bton{
        cursor: pointer;
    }
    tbody td{
        vertical-align: middle
    }
</style>
