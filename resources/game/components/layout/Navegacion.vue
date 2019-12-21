<template>
  <div class="float-left mr-2 marcoSuperior">
    <div class="marcoNavegacion">
        <div class="marco">
        </div>
        <div class="marco">
        </div>
        <div class="marco">
            <span v-if="data.island_id" @click='toIsland(data.island_id)'>{{$t('options.showIsland')}}</span>
            <span v-else>{{$t('options.showIsland')}}</span>
        </div>
        <div class="marco">
            <span @click='toCity()'>{{$t('options.showCity')}}</span>
        </div>
    </div>
    <div class="resourceF">
        <div class="resource" :title="$t('resources.wood')">
            <img :src="require('Img/icon/icon_wood.png')">
            <span>{{data.wood}}</span>
        </div>
        <div class="resource" :title="$t('resources.wine')">
            <img :src="require('Img/icon/icon_wine.png')">
            <span>{{data.wine}}</span>
        </div>
        <div class="resource" :title="$t('resources.marble')">
            <img :src="require('Img/icon/icon_marble.png')">
            <span>{{data.marble}}</span>
        </div>
        <div class="resource" :title="$t('resources.glass')">
            <img :src="require('Img/icon/icon_glass.png')">
            <span>{{data.glass}}</span>
        </div>
        <div class="resource" :title="$t('resources.sulfur')">
            <img :src="require('Img/icon/icon_sulfur.png')">
            <span>{{data.sulfur}}</span>
        </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import { catchAxios } from "Js/util.js";
    import $store from 'Stores/store.js'

    export default {
        data(){
            return {
                data:{}
            }
        },
        methods:{
            getResources(){
                axios("city/getResources/" + this.city_id)
                .then(res => {
                    this.data = res.data;
                })
                .catch(err => {
                    catchAxios(err);
                });
            },
            toIsland(island_id){
                axios('island/'+island_id)
                .then(res =>{
                    this.$router.push({ name: 'Island', params: { island:island_id,data: res.data }})
                })
                .catch(err => {
                    catchAxios(err);
                });
            },
            toCity(){
                axios("building/" + this.city_id)
                .then(res => {
                    this.$router.push({ name: 'City', params: { city:this.city_id,buildings: res.data }})
                })
                .catch(err => {
                    catchAxios(err);
                });
            }
        },
        computed:{
            city_id(){
                return $store.state.city_id;
            }
        },
        watch:{
            city_id(newval){
                this.getResources()
            }
        },
        mounted(){
            $store.subscribe(action => {
                if (action.type === 'reloadResources') {
                   this.getResources();
                }
            });
        }
    }
</script>

<style lang="css" scoped>
    .marcoNavegacion{
        height: 70px;
        display: flex;
    }
    .marco{
        display: flex;
        flex: auto;
    }
    .col-md-3{
        padding-left:5px;
        padding-right:5px;
    }
    .marcoSuperior{
        background: #bf9e72;
        z-index: 2;
        width: 420px;
        padding: 15px;
        border-radius: 5px;
        position: absolute;
        left: 5px;
    }
    .resourceF{
        display: flex
    }
    .resource{
        display: flex;
        flex: auto;
    }
</style>