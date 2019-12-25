<template>
    <div class="box">
        <div class="d-flex justify-content-center">
            <div>
                <div @click='ampliar' class="btn-apliar"><img :src="require('Img/icon/btn_upgrade.jpg')"></div>
                <div>{{$t('building.upgrade')}}</div>
            </div>
            <div class="px-2">
                <div>{{$t('building.level')}}</div>
                <div class="number">{{info.level-1}}</div>
            </div>
            <div>
                <div><img :src="require('Img/icon/btn_downgrade.jpg')"></div>
                <div>{{$t('building.demolition')}}</div>
            </div>
        </div>
        <div class="text-center mt-3">{{$t('building.upgradeText', { level: info.level })}}</div>
        <div class="my-2">
            <div class="d-inline-block" :title="$t('resources.wood')" v-if="info.wood!=0"><img :src="require('Img/icon/icon_wood.png')"> {{info.wood}}</div>
            <div class="d-inline-block" :title="$t('resources.wine')" v-if="info.wine!=0"><img :src="require('Img/icon/icon_wine.png')"> {{info.wine}}</div>
            <div class="d-inline-block" :title="$t('resources.marble')" v-if="info.marble!=0"><img :src="require('Img/icon/icon_marble.png')"> {{info.marble}}</div>
            <div class="d-inline-block" :title="$t('resources.glass')" v-if="info.glass!=0"><img :src="require('Img/icon/icon_glass.png')"> {{info.glass}}</div>
            <div class="d-inline-block" :title="$t('resources.sulfur')" v-if="info.sulfur!=0"><img :src="require('Img/icon/icon_sulfur.png')"> {{info.sulfur}}</div>
        </div>
        <div class="text-center" :title="$t('resources.time')" v-if="info.time!=0"><img :src="require('Img/icon/icon_time.png')"> {{$sectotime(info.time)}}</div>
    </div>
</template>

<script>
import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'
import $store from 'Stores/store'
import $resources from 'Stores/resources'

export default {
    name:'Ampliar',
    props:['info'],
    methods:{
        ampliar(){
            axios.put('building/upgrade/'+this.info.city_building_id)
            .then(res =>{
                if(res.data!='ok'){
                    callError(res)
                }else{
                    $store.commit('reloadBuilding');
                    $resources.commit('removeResources',{wood:this.info.wood,wine:this.info.wine,marble:this.info.marble,glass:this.info.glass,sulfur:this.info.sulfur});
                }
            })
            .catch(err =>{
                catchAxios(err)
            })
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