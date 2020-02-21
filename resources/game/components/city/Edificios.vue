<template>
  <div class="divBuilds" v-if="buildings.length > 0">

    <div v-for="(object, i) in objects" :key="i">
        <div class="object" :style="{ top: object.top + 'px', left: object.left + 'px' }">
            <div v-if="!checkBuilding(i)" class="terreno" :title="$t('building.title')" @click="modalConstruir(i)"></div>
        </div>
    </div>

    <div v-for="building in buildings" :key="'build_'+building.building_id">

        <div class="object" :style="{ top: objects[building.position].top + 'px', left: objects[building.position].left + 'px' }">
            <div
            class="building d-flex justify-content-center"
            :class="[building.constructed_at != null ? 'construct' : '','building_' + building.building_id]"
            @click="modalEdificio(building)"
            :title="$t(`buildings[${building.building_id}].name`) +' (' +building.level +')'"
            >
                <div class="valores" v-if="building.constructed_at != null" >{{ getConstructedTime(building.constructed_at) }}</div>
            </div>
        </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import $store from "Stores/store.js";
import $city from 'Stores/city'
import $modal from "Stores/modal.js";
import $resources from 'Stores/resources'
import $notification from 'Stores/notification'
import $building from 'Stores/building'

export default {
  name: "Edificios",
  data() {
    return {
      constructed_at: null,
      constructed_building: null,
      objects: [
        { top: 370, left: 1100 },
        { top: 350, left: 740 },
        { top: 258, left: 908 },
        { top: 250, left: 1285 },
        { top: 490, left: 1210 },
        { top: 545, left: 845 },
        { top: 430, left: 1395 },
        { top: 200, left: 1660 },
        { top: 160, left: 1490 },
        { top: 575, left: 1350 },
        { top: 330, left: 1700 },
        { top: 535, left: 1660 },
        { top: 575, left: 1080 },
        { top: 230, left: 700 },
        { top: 685, left: 900 }
      ]
    };
  },
  methods: {
    getConstructedTime(constructed_at){
        return this.$sectotime(moment.duration(moment(constructed_at).diff(moment(this.now))).asSeconds())
    },
    checkBuilding(position) {
      return (
        this.buildings.filter(x => {
          return x.position == position;
        }).length > 0
      );
    },
    buildingPosition(position) {
      return this.buildings.filter(x => {
        return x.position == position;
      });
    },
    modalConstruir(position) {
      axios
        .post("building/" + this.city_id, {
          position: position
        })
        .then(res => {
          $modal.commit('openModal',{
            type:0,
            info:{
              data:res.data,
              position:position
            }
          })
        })
        .catch(err => {
          $notification.commit('show',{advisor:1,type:false,message:err});
        });
    },
    modalEdificio(building){
      axios
        .post("building/nextLevel/" + building.building_id, {
          level: building.level
        })
        .then(res => {
          res.data.city_building_id = building.id
           $modal.commit('openModal',{
            type:1,
            info:res.data
          })
        })
        .catch(err => {
          $notification.commit('show',{advisor:1,type:false,message:err});
        });
    },
  },
  computed: {
    now(){
      return $store.state.now;
    },
    city_id() {
      return $city.state.city_id;
    },
    buildings(){
      return $building.getters.getBuildings
    }
  },
  watch: {
    city_id() {
      //$building.dispatch('updateBuilding')
    },
  }
};
</script>

<style lang="scss" scoped>
@import "~Sass/buildings";

.object {
  position: absolute;
  cursor: pointer;
  z-index: 1;
}
.terreno,
.building {
  height: 125px;
  width: 140px;
}
.building_1{
    width: 190px;
    height: 150px;
}
.building_16{
  height: 143px;
  width: 211px;
}
.building_17{
    background-position-x: center;
    height: 149px!important;
    width: 169px!important;
    position: relative;
    top: -25px;
    left: -7px;
}
.building_19{
    height: 102px;
    width: 161px;
    background-repeat: no-repeat !important;
    position: relative;
    top: 6px;
    right: 9px;
}
.construct {
  background: url("~Img/ciudad/construct.png") no-repeat !important;
}
.terreno {
  background: url("~Img/ciudad/terreno.png") no-repeat;
  background-position: center;
}
.valores{
    bottom: -5px;
}
</style>
