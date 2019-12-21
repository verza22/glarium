<template>
    <div>
        <Modal></Modal>
        <MenuSuperior></MenuSuperior>
        <router-view></router-view>
    </div>
</template>

<script>
import router from 'Js/router.js'
import MenuSuperior from "Components/layout/MenuSuperior.vue"
import $store from 'Stores/store.js'
import Modal from "Components/modal/Modal.vue";

export default {
    name:'Game',
    router,
    components:{
        MenuSuperior,
        Modal
    },
    mounted(){
        if(localStorage.city_id==undefined)
        {
            localStorage.setItem('city_id', this.$route.params.city)
        }
        $store.commit('changeCity',{city_id:localStorage.city_id});
    }
}
</script>