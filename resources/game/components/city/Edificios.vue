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
        { top: 396, left: 830 },
        { top: 350, left: 480 },
        { top: 472, left: 485 },
        { top: 400, left: 612 },
        { top: 520, left: 622 },
        { top: 540, left: 800 },
        { top: 505, left: 975 },
        { top: 370, left: 1010 },
        { top: 290, left: 930 },
        { top: 560, left: 1100 },
        { top: 475, left: 1180 },
        { top: 540, left: 1290 },
        { top: 660, left: 490 },
        { top: 230, left: 440 },
        { top: 685, left: 665 }
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
    updateBuilding(){
      //Verficamos cuando se construyan los edificios
      switch(this.constructed_building.building_id){
        case 2:
          //Actualizamos los investigadores
          $resources.commit('reloadPopulation');
        break;
      }
      //Actualizamos el edificio si tiene abierto el modal
      axios
        .post("building/nextLevel/" + this.constructed_building.building_id, {
          level: this.constructed_building.level +1
        })
        .then(res => {
          res.data.city_building_id = this.constructed_building.id
           $modal.commit('updateModal',{
            type:1,
            info:res.data
          })
        })
        .then(() => {
          this.constructed_building = null;
        });
    }
  },
  computed: {
    now(){
      return $store.state.now;
    },
    city_id() {
      return $store.state.city_id;
    },
    buildings(){
      return $building.state.buildings
    }
  },
  watch: {
    city_id() {
      $building.dispatch('updateBuilding')
    },
  },
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

.building_16{
  height: 143px;
  width: 211px;
}
.building_19{
  height: 100px;
  width: 163px;
  background-repeat: no-repeat!important;
  position: relative;
  top: 10px;
  right: 37px;
  background-size: contain!important;
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
