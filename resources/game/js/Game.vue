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
import $notification from 'Stores/notification'
import $resources from 'Stores/resources'
import $building from 'Stores/building'
import Modal from "Components/modal/Modal.vue";
import $city from 'Stores/city'

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
        $city.commit('setCityId',{city_id:city_id});
        $building.dispatch('updateBuilding')
    }
}
</script>
