<template>
<div>
  <div class="islandContainer" v-dragscroll="true" v-autoscroll="'center'">
    <div class="ocean">
      <div class="island">
        <Cities :cities='data.cities' v-if="data.cities"></Cities>
        <Resources :data='data'></Resources>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import { autoscroll } from 'vue-autoscroll'
import { catchAxios } from "Js/util.js";

import axios from 'axios'

import Cities from "Components/island/Cities.vue"
import Resources from "Components/island/Resources.vue"

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
  beforeMount(){
    if(this.$route.params.data!=undefined){
      this.data = this.$route.params.data;
    }else{
      axios('island/'+this.$route.params.island)
      .then(res =>{
        this.data = res.data;
      })
      .catch(err => {
          catchAxios(err);
      });
    }
  },
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