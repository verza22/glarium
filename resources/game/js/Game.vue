<template>
    <div>
        <MenuSuperior></MenuSuperior>
    </div>
</template>

<script>
import router from 'Js/router.js'
import MenuSuperior from "Components/layout/MenuSuperior.vue"
import $store from 'Stores/store.js'

export default {
    name:'Game',
    router,
    components:{
        MenuSuperior
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