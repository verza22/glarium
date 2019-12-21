<template>
    <div>
        <div><h6><small>{{$t('building.text')}}</small></h6></div>
        <div class="text-center font-weight-bold mb-3">{{$t('building.title')}}</div>
        <div class="row pb-3 mb-3 buildRow" v-for="(build,index) in building" :key='index'>
            <div class="col-3 m-auto">
                <div class="build" :class='[(build.research ? "" : "inactive"),"building_"+build.id]'></div>
            </div>
            <div class="col-6" >
                <div>
                    <div class="font-weight-bold mb-2">{{$t(`buildings[${build.id}].name`)}}</div>
                    <div class="text-justify mb-2 pb-2 borderRed">
                        <h6><small>{{$t(`buildings[${build.id}].text`)}}</small></h6>
                    </div>
                </div>
                <div>
                    <div class="d-inline-block" :title="$t('resources.wood')" v-if="build.wood!=0"><img :src="require('Img/icon/icon_wood.png')"> {{build.wood}}</div>
                    <div class="d-inline-block" :title="$t('resources.wine')" v-if="build.wine!=0"><img :src="require('Img/icon/icon_wine.png')"> {{build.wine}}</div>
                    <div class="d-inline-block" :title="$t('resources.marble')" v-if="build.marble!=0"><img :src="require('Img/icon/icon_marble.png')"> {{build.marble}}</div>
                    <div class="d-inline-block" :title="$t('resources.glass')" v-if="build.glass!=0"><img :src="require('Img/icon/icon_glass.png')"> {{build.glass}}</div>
                    <div class="d-inline-block" :title="$t('resources.sulfur')" v-if="build.sulfur!=0"><img :src="require('Img/icon/icon_sulfur.png')"> {{build.sulfur}}</div>
                    <div class="d-inline-block" :title="$t('resources.time')" v-if="build.time!=0"><img :src="require('Img/icon/icon_time.png')"> {{build.time.sectotime()}}</div>
                </div>
            </div>
            <div class="col-3 m-auto">
                <div class="text-center btnConstruir" v-if='build.research' @click='construir(build.id)'>{{$t('building.action')}}</div>
                <div v-else class="research">
                    <div>{{$t('building.research')}}</div>
                    <div>{{$t(`research[${build.research_id}].name`)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'
import customPrototypes from 'Prototypes/customPrototypes.js'
import $store from 'Stores/store.js'

export default {
    props:['info'],
    data(){
        return {
            building:[]
        }
    },
    methods:{
        construir(id){
            axios.put('building/'+this.info.city_id,{
                position:this.info.position,
                building:id
            })
            .then(res =>{
                if(res.data=='ok'){
                    this.$modal.hide("buildModal");
                    $store.commit('reloadBuilding');
                    $store.commit('reloadResources');
                }else{
                    callError(res);
                }
            })
            .catch(err =>{
                catchAxios(err)
            })
        },
        getBuildings(){
            axios.post('building/'+this.info.city_id,{
                position:this.info.position
            })
            .then(res =>{
                this.building = res.data;
            })
            .catch(err =>{
                catchAxios(err)
            })
        }
    },
    mounted(){
        this.getBuildings();
    }
}
</script>

<style lang="scss" scoped>
    @import "~Sass/modalBuild";
    @import "~Sass/buildings";

    .buildRow{
        border-bottom: 1px solid black;
    }
    .buildRow:last-child{
        border-bottom:0px;
        padding-bottom: 0px!important;
    }
    .btnConstruir{
        background: #eccf8e;
        cursor:pointer;
    }
    .borderRed{
        border-bottom: 1px solid #bc575d;
    }
    .inactive{
        opacity: 0.4;
    }
    .research{
        text-align: center;
        font-size:0.9rem
    }
</style>