<template>
  <div>
    <div class="cityContainer" v-dragscroll="true" v-autoscroll="'top center'">
        <div id="zoom">
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
  mounted(){
      this.$zoom()


  }
};
</script>

<style lang="css" scoped>
.cityContainer {
  cursor: all-scroll;
  height: 100%;
  width: 100%;
  position: absolute;
  overflow: hidden;
}
.city{
  width:2460px;
  height:1794px;
  background: url("~Img/ciudad/city.jpg");
}
</style>
