<template>
  <div class="divBuilds" v-if="buildings.length>0">
    <div
      class="object"
      :style="{top:object.top+'px',left:object.left+'px'}"
      v-for="(object,i) in objects"
      :key="i"
    >
      <div
        v-if="!checkBuilding(i)"
        class="terreno"
        :title="$t('building.title')"
        @click="modalConstruir(i)"
      ></div>
      <div
        v-else
        class="building"
        :class='[(building.constructed_at!=null ? "construct" : ""),"building_"+building.building_id]'
        v-for="(building,i2) in buildingPosition(i)"
        :key="i2"
        :title="$t(`buildings[${building.building_id}].name`)+' ('+building.level+')'"
      >
        <div class="builCclockDiv" v-if="building.constructed_at!=null">
          <div class="builCclock">
            <div class="arrowUpgrade"></div><div class="d-inline-block">{{(timeConstruct==null ? '00s' : timeConstruct)}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { catchAxios } from "Js/util.js";
import moment from 'moment'
import $store from 'Stores/store.js'

export default {
  name: "Edificios",
  data() {
    return {
      buildings: [],
      constructed_at: null,
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
      ],
    };
  },
  methods: {
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
    getBuilds() {
      //Consultamos los edificios
      axios("building/" + this.city_id)
      .then(res => {
        this.buildings = res.data;
        this.checkConstructed();
      })
      .catch(err => {
        catchAxios(err);
      });
    },
    modalConstruir(position) {
      this.$modal.show("buildModal", {
        building: 0,
        position: position,
        city_id: this.city_id
      });
    },
    checkConstructed() {
      var building = this.buildings.filter(x => {
        return x.constructed_at != null;
      });
      if(building.length>0){
        this.constructed_at = moment(building[0].constructed_at).add(2, 'seconds');
      }
    },
  },
  computed: {
    timeConstruct(){
        if(this.constructed_at!=null){
            return moment.duration(moment(this.constructed_at).diff(moment($store.state.now))).asSeconds().sectotime(); 
        }else{
            return null;
        }
    },
    city_id(){
      return $store.state.city_id;
    }
  },
  watch:{
    timeConstruct(newval){
      if(newval=='00s'){
        this.constructed_at = null;
        this.getBuilds();
      }
    },
    city_id(){
      this.getBuilds();
    }
  },
  mounted() {
    if(this.city_id!=null)
      this.getBuilds();

    $store.subscribe(action => {
      if (action.type === 'reloadBuilding') {
        this.getBuilds();
      }
    });
  }
};
</script>

<style lang="scss" scoped>

@mixin building($n) {
  background-image: url('~Img/ciudad/'+$n+'.png');
}

@for $i from 1 through 19 {
  .building_#{$i}{
    @include building($i);
  }
}

.object {
  position: absolute;
  cursor: pointer;
  z-index: 5;
}
.terreno,
.building {
  height: 125px;
  width: 140px;
}
/*
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
}*/
.construct {
  background: url('~Img/ciudad/construct.png') no-repeat !important;
}
.terreno {
  background: url('~Img/ciudad/terreno.png') no-repeat;
  background-position: center;
}
.builCclockDiv {
  position: absolute;
  width: 100%;
  bottom: -5px;
}
.arrowUpgrade {
  width: 15px;
  height: 11px;
  display: inline-block;
  margin-right: 10px;
  background: url('~Img/icon/arrow_upgrade.png');
}
.builCclock {
  width: fit-content;
  background: #fcf4de;
  margin: auto;
  border-radius: 20px;
  padding: 0px 12px 0px 10px;
  text-align: center;
  border: 1px solid #c37e2d;
  -webkit-box-shadow: 1px 2px 5px 0px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 1px 2px 5px 0px rgba(50, 50, 50, 0.75);
  box-shadow: 1px 2px 5px 0px rgba(50, 50, 50, 0.75);
}
</style>