<template>
  <div class="marcoSuperior">
    <div class="container">
      <div class="advisor mayor" :class="isActive(onMayor)" :title="$t('advisor.mayor.title')" @click='mayor'>
        <div class="titulo">{{$t('advisor.mayor.name')}}</div>
      </div>
      <div class="advisor general" :class="isActive(onGeneral)" :title="$t('advisor.general.title')" @click='general'>
        <div class="titulo">{{$t('advisor.general.name')}}</div>
      </div>
      <div class="advisor scientist" :class="isActive(onScientist)" :title="$t('advisor.scientist.title')" @click='scientist'>
        <div class="titulo">{{$t('advisor.scientist.name')}}</div>
      </div>
      <div class="advisor diplomat" :class="isActive(onDiplomat)" :title="$t('advisor.diplomat.title')" @click='diplomat'>
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
    data(){
        return {
            onMayor:false,
            onGeneral:false,
            onScientist:false,
            onDiplomat:false
        }
    },
    methods:{
        isActive(advisor){
            return advisor ? 'active' : ''
        },
        mayor(){
            this.onMayor = false;
            axios("user/getMayor?page=1").then(res => {
                $modal.commit('openModal',{type:8,info:res.data})
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        },
        general(){
            $modal.commit('openModal',{type:7,info:{}})
        },
        scientist(){
            $modal.commit('openModal',{type:3,info:{}})
        },
        diplomat(){
            this.onDiplomat = false;
            axios.post("user/getMessages",{
                type:0,
                page:1
            }).then(res => {
                $modal.commit('openModal',{type:5,info:res.data})
            })
            .catch(err => {
                $notification.commit('show',{advisor:4,type:false,message:err});
            });
        },
        advisorsNotification(data){
            switch(data){
                case 'mayor':
                    this.onMayor = true;
                break;
                case 'general':
                    this.onGeneral = true;
                break;
                case 'scientist':
                    this.onScientist = true;
                break;
                case 'diplomat':
                    this.onDiplomat = true;
                break;
            }
        },
        checkMsg(){
            //Verifica si hay mensajes sin leer
            axios('user/unread')
            .then(res =>{
                if(res.data.message>0){
                    //Hay mensajes sin leer
                    this.onDiplomat = true;
                }
                if(res.data.mayor>0){
                    //Hay mensajes sin leer
                    this.onMayor = true;
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:1,type:false,message:err});
            })
        }
    },
    beforeMount(){
        $movement.dispatch('updateMovemenet')
        this.checkMsg()
    },
    mounted(){
        this.$chUser.bind('advisors', (data) => {
            this.advisorsNotification(data.data)
        });
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
.mayor.active{
  background-image: url('~Img/advisor/mayor_active.png');
}
.general.active{
  background-image: url('~Img/advisor/general_active.png');
}
.scientist.active{
  background-image: url('~Img/advisor/scientist_active.png');
}
.diplomat.active{
  background-image: url('~Img/advisor/diplomat_active.png');
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
