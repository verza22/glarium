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
                    <ActionPoint></ActionPoint>
                    <Population></Population>
                  </div>
              </div>
              <div class="flex-3 d-flex btn-game">
                  <div class="flex-1 btn-world" :title="$t('options.navigation.worldTitle')">
                      <div class="btn-game-text">{{$t('options.navigation.world')}}</div>
                  </div>
                  <div class="flex-1 btn-island" :title="$t('options.navigation.islandTitle')">
                      <div class="btn-game-text">{{$t('options.navigation.island')}}</div>
                  </div>
                  <div class="flex-1 btn-city" @click='toCity()' :title="$t('options.navigation.cityTitle')">
                      <div class="btn-game-text">{{$t('options.navigation.city')}}</div>
                  </div>
              </div>
          </div>
        <Resources></Resources>
      </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import Resources from 'Components/layout/navigation/Resources.vue'
    import Population from 'Components/layout/navigation/Population.vue'
    import ActionPoint from 'Components/layout/navigation/ActionPoint.vue'
    import { catchAxios } from "Js/util.js";
    import $store from 'Stores/store.js'

    export default {
        name:'Navegacion',
        components:{
            Resources,
            Population,
            ActionPoint
        },
        data(){
            return {
                data:{}
            }
        },
        methods:{
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
</style>