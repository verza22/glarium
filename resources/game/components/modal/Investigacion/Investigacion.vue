<template>
    <div class="mBorder">
        <Ventana1 :close='close' titulo="test2">
            <Investigaciones></Investigaciones>
        </Ventana1>
        <Ventana2 titulo="test1">
            <Categorias></Categorias>
        </Ventana2>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Ventana2 from 'Components/modal/Ventanas/Ventana2.vue'
import Categorias from 'Components/modal/Investigacion/Categorias.vue'
import Investigaciones from 'Components/modal/Investigacion/Investigaciones.vue'

export default {
    name: 'Investigacion',
    props:['close','info'],
    components:{
        Ventana1,
        Ventana2,
        Categorias,
        Investigaciones
    },
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>