<template>
<div>
  <div
    class="islandContainer"
    v-on:dragscrollmove="doSomething(detail,$event.detail.deltaX,$event.detail.deltaY)"
    v-dragscroll="true"
    v-autoscroll="{ x: detail.deltaX, y: detail.deltaY, type: 'absolute'}"
    v-if='data.length>0'
  >
    <div class="ocean">
        <Islas :x='x' :y='y' :wsize='wsize' :hsize='hsize' :data='data'></Islas>
    </div>
  </div>
</div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll'
import { autoscroll } from 'vue-autoscroll'
import Islas from 'Components/world/Islas.vue'

import $notification from 'Stores/notification'
import axios from 'axios'

export default {
  name: 'World',
  directives: {
    dragscroll,
    autoscroll
  },
  components:{
    Islas
  },
  data(){
    return {
      data:[],
      n:5,//para saber cuando cambia cada x o y plazas volvemos a cargar las islas
      x:parseInt(this.$route.params.x),
      y:parseInt(this.$route.params.y),
      wsize:238,
      hsize:120,
      wscreen:(window.screen.availWidth/2)-150,
      hscreen:(window.screen.availHeight/2)-75,
      detailInit: {
        deltaX: 0,
        deltaY: 0,
      },
      detail: {
        deltaX: 0,
        deltaY: 0,
      },
    }
  },
  methods:{
      doSomething(test,deltaX,deltaY){
          this.detail.deltaX += deltaX
          this.detail.deltaY += deltaY
          var x = this.detail.deltaX/this.wsize
          var y = this.detail.deltaY/this.hsize
          var xi = this.detailInit.deltaX/this.wsize
          var yi = this.detailInit.deltaY/this.hsize
          if(x<xi-this.n||x>xi+this.n||y<yi-this.n||y>yi+this.n){
            //Llamamos de nuevo por mas datos
            this.x = Math.round(x)
            this.y = Math.round(y)
            this.init(false)
          }
      },
      init(type){
        if(type){
            this.detail.deltaX = (this.x*this.wsize)-this.wscreen;
            this.detail.deltaY = (this.y*this.hsize)-this.hscreen;
        }
        this.detailInit.deltaX = (this.x*this.wsize)-this.wscreen;
        this.detailInit.deltaY = (this.y*this.hsize)-this.hscreen;
        axios('world/'+this.x+'/'+this.y)
        .then(res =>{
            this.data = res.data;
        })
        .catch(err => {
            $notification.commit('show',{advisor:1,type:false,message:err});
        });
      }
  },
  beforeMount(){
    if(this.$route.params.data!=undefined){
        this.data = this.$route.params.data;
        this.detail.deltaX = (this.x*this.wsize)-this.wscreen;
        this.detail.deltaY = (this.y*this.hsize)-this.hscreen;
        this.detailInit.deltaX = (this.x*this.wsize)-this.wscreen;
        this.detailInit.deltaY = (this.y*this.hsize)-this.hscreen;
    }else{
        this.init(true);
    }
  },
};

</script>

<style lang="css" scoped>
.ocean{
  height: 100000px;
  width: 100000px;
  background: url('~Img/world/ocean.png');
}
.islandContainer {
  cursor: grab;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height:100%;
}
</style>
