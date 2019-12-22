<template>
  <div class="marcoSuperior d-flex">
      <div class="flex-1">
          <div class="premium"></div>
          <div class="ships"></div>
          <div class="gold"></div>
      </div>
      <div class="flex-4 d-flex flex-column">
          <div class="flex-2 d-flex">
              <div class="flex-2 d-flex flex-column btn-navi-popu">
                  <div class="flex-1 navigation-box">
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
                  <div class="flex-1 btn-world" :title="$t('options.navigation.worldTitle')">
                      <div class="btn-game-text">{{$t('options.navigation.world')}}</div>
                  </div>
                  <div class="flex-1 btn-island" @click='toIsland(data.island_id)' :title="$t('options.navigation.islandTitle')">
                      <div class="btn-game-text">{{$t('options.navigation.island')}}</div>
                  </div>
                  <div class="flex-1 btn-city" @click='toCity()' :title="$t('options.navigation.cityTitle')">
                      <div class="btn-game-text">{{$t('options.navigation.city')}}</div>
                  </div>
              </div>
          </div>
          <div class="flex-1 d-flex resources">
              <div class="flex-1 d-flex">
                  <div class="d-flex align-items-center">
                      <img class="mr-1" :src="require('Img/icon/icon_wood.png')">
                      <span>{{data.wood}}</span>
                  </div>
              </div>
              <div class="flex-1 d-flex">
                  <div class="d-flex align-items-center">
                      <img class="mr-1" :src="require('Img/icon/icon_wine.png')">
                      <span>{{data.wine}}</span>
                  </div>
              </div>
              <div class="flex-1 d-flex">
                  <div class="d-flex align-items-center">
                      <img class="mr-1" :src="require('Img/icon/icon_marble.png')">
                      <span>{{data.marble}}</span>
                  </div>
              </div>
              <div class="flex-1 d-flex">
                  <div class="d-flex align-items-center">
                      <img class="mr-1" :src="require('Img/icon/icon_glass.png')">
                      <span>{{data.glass}}</span>
                  </div>
              </div>
              <div class="flex-1 d-flex">
                  <div class="d-flex align-items-center">
                      <img class="mr-1" :src="require('Img/icon/icon_sulfur.png')">
                      <span>{{data.sulfur}}</span>
                  </div>
              </div>
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
    .marcoSuperior{
        font-size: 0.83rem;
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
        padding: 0px 4px;
        font-size: 11px;
        user-select: none;
    }
    .btn-game-text{
        position: absolute;
        bottom: 1px;
        width: 100%;
        text-align: center;
    }
    .btn-world{
        background-image: url('~Img/icon/btn_world.jpg');
        background-repeat: no-repeat;
        position: relative;
        cursor: pointer;
        height: 53px;
    }
    .btn-island{
        background-image: url('~Img/icon/btn_island.jpg');
        background-repeat: no-repeat;
        position: relative;
        cursor: pointer;
        height: 53px;
    }
    .btn-city{
        background-image: url('~Img/icon/btn_city.png');
        background-repeat: no-repeat;
        position: relative;
        cursor: pointer;
        bottom: 4px;
        height: 58px;
    }
    .btn-city:hover,.btn-island:hover,.btn-world:hover{
        background-position-y: center;
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
    .btn-navi-popu{
        padding-left: 2px;
    }
    .navigation-box{
        padding: 1px 0px 0px 4px;
    }
    .navigation{
        background-image: url('~Img/icon/navigation.jpg');
        height: 24px;
        background-size: cover;
    }
    .resources{
        padding-left: 5px;
    }
</style>