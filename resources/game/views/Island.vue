<template>
<div>
  <div class="islandContainer" v-dragscroll="true" v-autoscroll="'center'">
    <div class="ocean">
      <div class="island">
        <Cities :data='data' v-if="data.cities"></Cities>
        <Resources :data='data'></Resources>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import { autoscroll } from 'vue-autoscroll'
import $notification from 'Stores/notification'

import axios from 'axios'

import Cities from "Components/island/Cities.vue"
import Resources from "Components/island/Resources.vue"
import $store from 'Stores/store'
import $city from 'Stores/city'
import $modal from 'Stores/modal'

export default {
  name: 'Isla',
  directives: {
    dragscroll,
    autoscroll
  },
  components:{
    Cities,
    Resources
  },
  data(){
    return {
      data:{}
    }
  },
  methods:{
      init(){
        axios('island/'+this.$route.params.island)
        .then(res =>{
            this.data = res.data;
        })
        .catch(err => {
            $notification.commit('show',{advisor:1,type:false,message:err});
        });
      },
      setIsland(island){
        this.data = island;
      }
  },
  beforeMount(){
    if(this.$route.params.data!=undefined){
        this.setIsland(this.$route.params.data)
    }else{
        this.init();
    }
  },
  updated: function () {
    this.$nextTick(function () {
        if(this.data.focusCity){
            //Despues que se actualize la isla hacemos el focus
            $city.commit('setFocusCity',{focusCity:this.data.focusCity})
        }
    })
  },
  mounted(){
    if(this.$route.params.data.focusCity!=undefined){
        $city.commit('setFocusCity',{focusCity:this.$route.params.data.focusCity})
    }
    $store.subscribe((action,state) => {
        if (action.type === "reloadIslandData") {
            this.init();
        }
    });
    $city.subscribe((action,state) => {
        if (action.type === "setIsland") {
            this.setIsland(state.island)
        }
    });
  }
};

</script>

<style lang="css" scoped>
.ocean{
  width: 2400px;
  height: 1800px;
  background: url('~Img/island/ocean.jpg');
}
.islandContainer {
  cursor: grab;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height:100%;
}
.island{
  position:relative;
  top: 430px;
  left: 500px;
  width: 1386px;
  height: 924px;
  z-index: 1;
  background: url('~Img/island/0.jpg');
}
</style>
