<template>
    <div class="box pt-0">
        <div class="gtitle text-center">Colonia Polis</div>
        <Informacion></Informacion>
        <Aviso></Aviso>
        <Satisfaccion></Satisfaccion>
    </div>
</template>

<script>
import Informacion from 'Components/modal/Edificios/Intendencia/Informacion.vue'
import Aviso from 'Components/modal/Edificios/Intendencia/Aviso.vue'
import Satisfaccion from 'Components/modal/Edificios/Intendencia/Satisfaccion.vue'

export default {
    name:'Intendencia',
    components:{
        Informacion,
        Aviso,
        Satisfaccion
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
</style>
