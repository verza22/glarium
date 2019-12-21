<template>
  <div>
    <div class="cityContainer" v-dragscroll="true" v-autoscroll="'top center'">
      <div class="forest">
        <div class="city">
            <Edificios></Edificios>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import { autoscroll } from 'vue-autoscroll'

import Edificios from "Components/city/Edificios.vue";


export default {
  name: "City",
  directives: {
    dragscroll,
    autoscroll
  },
  components:{
    Edificios,
  },
};
</script>

<style lang="css" scoped>
.cityContainer {
  cursor: grab;
  height: 100%;
  width: 100%;
  position: absolute;
  overflow: hidden;
}
.forest{
  width:3600px;
  height:1794px;
  background: url("~Img/ciudad/forest.jpg");
}
.city{
  position:relative;
  left: 830px;
  width:1920px;
  height:1794px;
  background: url("~Img/ciudad/city.jpg");
}
</style>