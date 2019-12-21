<template>
  <div>
    <div class="cityContainer" v-dragscroll="true" v-autoscroll="'top center'">
      <div class="forest">
        <div class="city">
            <Edificios></Edificios>
        </div>
      </div>
    </div>
    <EdificiosModal></EdificiosModal>
  </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import { autoscroll } from 'vue-autoscroll'

import Edificios from "Components/city/Edificios.vue";
import EdificiosModal from "Components/city/EdificiosModal.vue";

export default {
  name: "City",
  directives: {
    dragscroll,
    autoscroll
  },
  components:{
    Edificios,
    EdificiosModal
  },
};
</script>

<style lang="css" scoped>
.cityContainer {
  cursor: grab;
  height: 100%;
  overflow: hidden;
  width: 100%;
}
.forest{
  width:3600px;
  height:1794;
  background: url("/img/ciudad/forest.jpg");
}
.city{
  position:relative;
  left: 830px;
  width:1920px;
  height:1794;
  background: url("/img/ciudad/city.jpg");
}
</style>