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
                        <div class="position-relative">
                            <img @click="viewDetail(movement)" class="bton" :src="require('Img/icon/movement/magnifySmall.png')"  title="Ver cargamento">
                            <Recursos :close="closeDetail" :movement='movement' v-if="movement.detail"></Recursos>
                        </div>
                    </td>
                    <td>
                        <div>{{movement.city_from.name}}</div>
                        <div>({{movement.city_from.user}})</div>
                    </td>
                    <td v-html="getArrow(movement)">
                    </td>
                    <td>
                        <div>{{movement.city_to.name}}</div>
                        <div>({{movement.city_to.user}})</div>
                    </td>
                    <td>
                        <div class="position-relative">
                            <div @click="openConfirm(movement)" title="Retirar"><img class="bton" :src="require('Img/icon/movement/btn_abort.png')"></div>
                            <Confirmar :close='closeConfirm' :confirm='confirmRemove' :data='movement' v-if="movement.confirm"></Confirmar>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import $store from "Stores/store";
import Recursos from 'Components/modal/General/Recursos.vue'
import Confirmar from 'Components/other/Confirmar.vue'
import $notification from 'Stores/notification'
import $config from 'Stores/config'
import $resources from 'Stores/resources'
import $movement from 'Stores/movement'

export default {
    name: 'Movimientos',
    props:['movements'],
    components:{
        Recursos,
        Confirmar
    },
    methods:{
        confirmRemove(movement){
            movement.confirm = false;
            axios.delete('movement/'+movement.id)
            .then(res =>{
                if(res.data=='ok1'||res.data=='ok2'){
                    if(res.data=='ok1'){//Cuando estaba cargando
                        switch(movement.movement_type_id){
                            case 1:
                                $resources.commit('produceResources',movement.resources);
                            break;
                            case 4:
                                $resources.commit('produceResources',{wood:this.cost_wood});
                                $resources.commit('increasePopulation',{increasePopulation:this.cost_population})
                                $resources.commit('addGold',{gold:this.cost_gold});
                                if(this.$route.name=='Island'){
                                    $store.commit('reloadIslandData');
                                }
                            break;
                        }
                        $resources.commit('addApoint');
                        $resources.commit('addTradeShip',{ships:movement.trade_ship});
                    }
                    $movement.dispatch('updateMovemenet')
                    $notification.commit('show',{advisor:2,type:true});
                }else{
                    $notification.commit('show',{advisor:2,type:false,message:res.data});
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:2,type:false,message:err});
            })
        },
        openConfirm(movement){
            movement.confirm = true;
        },
        closeConfirm(movement){
            movement.confirm = false;
        },
        closeDetail(movement){
            movement.detail = false;
        },
        viewDetail(movement){
            if(movement.detail){
                movement.detail = false;
            }else{
                movement.detail = true;
            }
        },
        getHorario(movement){
            var tipo = this.$checkHorarioTipo(movement)
            var texto = 'Retornando';
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
        getArrow(movement){
            var tipo = this.$checkHorarioTipo(movement)
            var tipo_movimiento = '';
            switch(movement.movement_type_id){
                case 1:
                    tipo_movimiento = 'Transporte '
                break;
                case 4:
                    tipo_movimiento = 'Colonizando '
                break;
            }
            var texto = '(Retornando)';
            var image = 'right';
            switch(tipo){
                case 1:
                    texto = '(Cargando)'
                break;
                case 2:
                    texto = '(En marcha)'
                break;
                case 3:
                    texto = '(Retornando)'
                    image = 'left'
                break;
            }
            return `
                <img title="${tipo_movimiento+' '+texto}" src="${require('Img/icon/movement/arrow_'+image+'_green.png')}">
            `;
        },
        calculateTime(time){
            var aux = moment.duration(moment(time).diff(moment(this.now))).asSeconds()
            aux = aux<0 ? 0 : aux
            aux = isNaN(aux) ? 0 : aux
            return this.$sectotime(aux)
        }
    },
    computed:{
        now(){
            return $store.state.now;
        },
        cost_gold(){
            return $config.state.world.colonize.gold;
        },
        cost_wood(){
            return $config.state.world.colonize.wood;
        },
        cost_population(){
            return $config.state.world.colonize.population;
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
