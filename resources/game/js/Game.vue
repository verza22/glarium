<template>
    <div>
        <Modal></Modal>
        <MenuSuperior></MenuSuperior>
        <router-view></router-view>
    </div>
</template>

<script>
import axios from 'axios'
import router from 'Js/router.js'
import MenuSuperior from "Components/layout/MenuSuperior.vue"
import $store from 'Stores/store'
import $notification from 'Stores/notification'
import $resources from 'Stores/resources'
import $building from 'Stores/building'
import Modal from "Components/modal/Modal.vue";

export default {
    name:'Game',
    router,
    components:{
        MenuSuperior,
        Modal
    },
    mounted(){
        if(localStorage.city_id==undefined){
            var city_id = this.$route.params.city;
        }else{
            var city_id = localStorage.city_id;
        }
        $store.commit('changeCity',{city_id:city_id});
        $building.commit('updateBuilding')
    }
}
</script>
