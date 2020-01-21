<template>
    <div class="box">
        <Entrenar :units='data.units'/>
        <Formar :units='data.units'/>
    </div>
</template>

<script>
import Entrenar from 'Components/modal/Edificios/Cuartel/Entrenar.vue'
import Formar from 'Components/modal/Edificios/Cuartel/Formar.vue'

export default {
    name:'Cuartel',
    props:['data'],
    components:{
        Entrenar,
        Formar
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem
    }
</style>
