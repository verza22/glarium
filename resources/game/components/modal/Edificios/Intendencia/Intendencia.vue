<template>
    <div class="box pt-0">
        <div class="gtitle text-center">Colonia Polis</div>
        <Informacion></Informacion>
    </div>
</template>

<script>
import Informacion from 'Components/modal/Edificios/Intendencia/Informacion.vue'

export default {
    name:'Intendencia',
    components:{
        Informacion
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
</style>
