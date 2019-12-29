<template>
    <div class="box">
        <div class="d-flex justify-content-center">
            <div v-if="!this.info.maximum">
                <div @click='ampliar' class="btn-apliar"><img :src="require('Img/icon/btn_upgrade.jpg')"></div>
                <div>{{$t('building.upgrade')}}</div>
            </div>
            <div class="px-2">
                <div>{{$t('building.level')}}</div>
                <div class="number">{{level}}</div>
            </div>
            <div>
                <div><img :src="require('Img/icon/btn_downgrade.jpg')"></div>
                <div>{{$t('building.demolition')}}</div>
            </div>
        </div>
        <div class="text-center mt-3">{{$t('building.upgradeText', { level: info.level })}}</div>
        <div class="my-2">
            <div class="d-inline-block" :title="$t('resources.wood')" v-if="info.wood!=0"><img :src="require('Img/icon/icon_wood.png')"> {{$money(info.wood*reducerWoodBuilding)}}</div>
            <div class="d-inline-block" :title="$t('resources.wine')" v-if="info.wine!=0"><img :src="require('Img/icon/icon_wine.png')"> {{$money(info.wine*reducerWineBuilding)}}</div>
            <div class="d-inline-block" :title="$t('resources.marble')" v-if="info.marble!=0"><img :src="require('Img/icon/icon_marble.png')"> {{$money(info.marble*reducerMarbleBuilding)}}</div>
            <div class="d-inline-block" :title="$t('resources.glass')" v-if="info.glass!=0"><img :src="require('Img/icon/icon_glass.png')"> {{$money(info.glass*reducerGlassBuilding)}}</div>
            <div class="d-inline-block" :title="$t('resources.sulfur')" v-if="info.sulfur!=0"><img :src="require('Img/icon/icon_sulfur.png')"> {{$money(info.sulfur*reducerSulfurBuilding)}}</div>
        </div>
        <div class="text-center" :title="$t('resources.time')" v-if="info.time!=0"><img :src="require('Img/icon/icon_time.png')"> {{$sectotime(info.time)}}</div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store'
import $resources from 'Stores/resources'
import $notification from 'Stores/notification'

export default {
    name:'Ampliar',
    props:['info'],
    methods:{
        ampliar(){
            axios.put('building/upgrade/'+this.info.city_building_id)
            .then(res =>{
                if(res.data!='ok'){
                    $notification.commit('show',{advisor:1,type:false,message:res.data});
                }else{
                    $store.commit('reloadBuilding');
                    $notification.commit('show',{advisor:1,type:true});
                    $resources.commit('removeResources',{
                        wood:this.info.wood*this.reducerWoodBuilding,
                        wine:this.info.wine*this.reducerWineBuilding,
                        marble:this.info.marble*this.reducerMarbleBuilding,
                        glass:this.info.glass*this.reducerGlassBuilding,
                        sulfur:this.info.sulfur*this.reducerSulfurBuilding
                    });
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:1,type:false,message:err});
            })
        }
    },
    computed:{
        level(){
            return this.info.maximum ? this.info.level : this.info.level -1;
        },
        reducerWoodBuilding(){
            return $resources.getters.reducerWoodBuilding;
        },
        reducerWineBuilding(){
            return $resources.getters.reducerWineBuilding;
        },
        reducerMarbleBuilding(){
            return $resources.getters.reducerMarbleBuilding;
        },
        reducerGlassBuilding(){
            return $resources.getters.reducerGlassBuilding;
        },
        reducerSulfurBuilding(){
            return $resources.getters.reducerSulfurBuilding;
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        padding: 12px 20px!important;
    }
    .number{
        text-align: center;
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 1.8rem;
    }
</style>
