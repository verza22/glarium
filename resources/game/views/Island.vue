<template>
<div>
  <div class="islandContainer" v-dragscroll="true" v-autoscroll="'center'">
    <div class="ocean">
      <div class="island">
        <Cities :cities='data.cities' v-if="data.cities"></Cities>
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

export default {
  name: 'Isla',
  directives: {
    dragscroll,
    autoscroll
  },
  components:{
    Cities
  },
  data(){
    return {
      data:{}
    }
  },
  methods:{
      getCities(){
        axios('island/'+this.$route.params.island)
        .then(res =>{
          this.data = res.data;
        })
        .catch(err => {
            catchAxios(err);
        });
    }
  },
  mounted(){
      this.getCities()
  }
};

</script>

<style lang="css" scoped>
.ocean{
  width: 2400px;
  height: 1800px;
  background: url(/img/island/ocean.jpg);
}
.islandContainer {
  cursor: grab;
  overflow: hidden;
  width: 100%;
  height:100%;
}
.island{
  position:relative;
  top: 430;
  left: 500;
  width: 1386px;
  height: 924px;
  z-index: 1;
  background: url(/img/island/0.jpg);
}
</style>