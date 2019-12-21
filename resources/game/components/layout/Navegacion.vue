<template>
  <div class="float-left mr-2 marcoSuperior">
    <div class="row marcoNavegacion">
        <div class="col-md-3">
        </div>
        <div class="col-md-3">
        </div>
        <div class="col-md-3">
            <router-link v-if="data.island_id" :to="{ name: 'Island', params: { island: data.island_id }}">{{$t('options.showIsland')}}</router-link>
            <a href="#" v-else>{{$t('options.showIsland')}}</a>
        </div>
        <div class="col-md-3">
            <router-link :to="{ name: 'City', params: { city: city_id }}">{{$t('options.showCity')}}</router-link>
        </div>
    </div>
    <div class="d-flex bd-highlight">
        <div class="flex-fill bd-highlight" :title="$t('resources.wood')">
            <img :src="require('Img/icon/icon_wood.png')">
            <span>{{data.wood}}</span>
        </div>
        <div class="flex-fill bd-highlight" :title="$t('resources.wine')">
            <img :src="require('Img/icon/icon_wine.png')">
            <span>{{data.wine}}</span>
        </div>
        <div class="flex-fill bd-highlight" :title="$t('resources.marble')">
            <img :src="require('Img/icon/icon_marble.png')">
            <span>{{data.marble}}</span>
        </div>
        <div class="flex-fill bd-highlight" :title="$t('resources.glass')">
            <img :src="require('Img/icon/icon_glass.png')">
            <span>{{data.glass}}</span>
        </div>
        <div class="flex-fill bd-highlight" :title="$t('resources.sulfur')">
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
        },
        computed:{
            city_id(){
                return $store.state.city_id;
            }
        },
        mounted(){
            this.getResources();
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
    }
    .col-md-3{
        padding-left:5px;
        padding-right:5px;
    }
    .marcoSuperior{
        background: #bf9e72;
        z-index: 5;
        width: 420px;
        height: 116px;
        margin-top: 24px;
        position: relative;
        padding: 15px;
        border-radius: 5px;
    }
</style>