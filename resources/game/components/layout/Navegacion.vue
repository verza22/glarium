<template>
  <div class="marcoSuperior d-flex">
      <div class="flex-1">
          <div class="premium"></div>
          <div class="ships"></div>
          <div class="gold"></div>
      </div>
      <div class="flex-4 d-flex flex-column">
          <div class="flex-2 d-flex">
              <div class="flex-2 d-flex flex-column">
                  <div class="flex-1">
                      <div class="navigation"></div>
                  </div>
                  <div class="flex-1 d-flex">
                    <div class="flex-1 d-flex">
                        <div class="action"></div>
                        <div>3</div>
                    </div>
                    <div class="flex-2 d-flex">
                        <div class="population"></div>
                        <div>60 (60)</div>
                    </div>
                  </div>
              </div>
              <div class="flex-3 d-flex btn-game">
                  <div class="flex-1 btn-world"></div>
                  <div class="flex-1 btn-island"></div>
                  <div class="flex-1 btn-city"></div>
              </div>
          </div>
          <div class="flex-1">0</div>
      </div>
    <!--
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
    </div>-->
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
    .marcoSuperior{
        z-index: 2;
        width: 600px;
        padding: 25px 40px 10px 10px;
        border-radius: 5px;
        position: absolute;
        background-repeat: no-repeat;
        background-image: url('~Img/icon/navegacion_fondo.png');
    }
    .ships{
        background-image: url('~Img/icon/ships.jpg');
        width: 110px;
        height: 30px;
    }
    .gold{
        background-image: url('~Img/icon/gold.jpg');
        width: 110px;
        height: 30px;
    }
    .premium{
        background-image: url('~Img/icon/premium.png');
        width: 110px;
        height: 30px;
        background-size: cover;
    }
    .btn-game{
        padding: 0px 10px;
    }
    .btn-world{
        background-image: url('~Img/icon/btn_world.jpg');
        background-repeat: no-repeat;
        height: 53px;
    }
    .btn-island{
        background-image: url('~Img/icon/btn_island.jpg');
        background-repeat: no-repeat;
        height: 53px;
    }
    .btn-city{
        background-image: url('~Img/icon/btn_city.png');
        background-repeat: no-repeat;
        position: relative;
        bottom: 4px;
        height: 58px;
    }
    .action{
        background-image: url('~Img/icon/action_point.png');
        width: 25px;
        height: 25px;
    }
    .population{
        background-image: url('~Img/icon/population.png');
        width: 35px;
        height: 23px;
        margin-right: 5px;
    }
    .navigation{
        background-image: url('~Img/icon/navigation.jpg');
    }
</style>