<template>
  <div class="marcoSuperior">
    <div class="container">
      <div class="advisor mayor" :title="$t('advisor.mayor.title')">
        <div class="titulo">{{$t('advisor.mayor.name')}}</div>
      </div>
      <div class="advisor general" :title="$t('advisor.general.title')">
        <div class="titulo">{{$t('advisor.general.name')}}</div>
      </div>
      <div class="advisor scientist" :title="$t('advisor.scientist.title')" @click='scientist'>
        <div class="titulo">{{$t('advisor.scientist.name')}}</div>
      </div>
      <div class="advisor diplomat" :title="$t('advisor.diplomat.title')" @click='diplomat'>
        <div class="titulo">{{$t('advisor.diplomat.name')}}</div>
      </div>
      <Notification></Notification>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $modal from "Stores/modal.js";
import Notification from 'Components/layout/Notification.vue'
import $notification from 'Stores/notification'
import $movement from 'Stores/movement'

export default {
    name: "Consejeros",
    components:{
        Notification
    },
    methods:{
        scientist(){
            $modal.commit('openModal',{type:3,info:{}})
        },
        diplomat(){
            axios("user/getMessage").then(res => {
                $modal.commit('openModal',{type:5,info:res.data})
            })
            .catch(err => {
            $notification.commit('show',{advisor:1,type:false,message:err});
            });
        }
    },
    beforeMount(){
        $movement.dispatch('updateMovemenet')
    }
};
</script>

<style lang="scss" scoped>
.marcoSuperior {
  z-index: 2;
  position: absolute;
  right: 5px;
}
.container{
  background-image: url('~Img/advisor/container.png');
  height: 130px;
  width: 394px;
  padding: 19px 0 0 16px;
}
.mayor{
  background-image: url('~Img/advisor/mayor.png');
}
.general{
  background-image: url('~Img/advisor/general.png');
}
.scientist{
  background-image: url('~Img/advisor/scientist.png');
}
.diplomat{
  background-image: url('~Img/advisor/diplomat.png');
}
.advisor{
  position: relative;
  float: left;
  left: 0;
  top: 0;
  width: 90px;
  height: 108px;
  cursor: pointer;
}
.titulo{
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 11px;
  padding: 2px 4px;
}
</style>
