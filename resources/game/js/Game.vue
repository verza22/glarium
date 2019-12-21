<template>
    <div>
        <MenuSuperior></MenuSuperior>
    </div>
</template>

<script>
import router from 'Js/router.js'
import MenuSuperior from "Components/layout/MenuSuperior.vue"

export default {
    name:'Game',
    router,
    components:{
        MenuSuperior
    }
}
</script>