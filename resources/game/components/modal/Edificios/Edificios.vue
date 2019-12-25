<template>
    <div class="mBorder">
        <Ventana1 :close='close' :titulo="$t(`buildings[${info.building_id}].name`)">
            <div class="gtitle box">{{$t(`buildings[${info.building_id}].text`)}}</div>
            <Intendencia v-if='info.building_id==1' :data='info'></Intendencia>
            <Academia v-else-if='info.building_id==2' :data='info'></Academia>
        </Ventana1>
        <Ventana2 titulo="Ampliar">
            <Ampliar :info='info'></Ampliar>
        </Ventana2>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Ventana2 from 'Components/modal/Ventanas/Ventana2.vue'
import Ampliar from 'Components/modal/Edificios/Ampliar.vue'
import Intendencia from 'Components/modal/Edificios/Intendencia.vue';
import Academia from 'Components/modal/Edificios/Academia.vue';

export default {
    name: 'Edificios',
    props:['info','close'],
    components:{
        Ventana1,
        Ventana2,
        Ampliar,
        Intendencia,
        Academia
    },
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
    .gtitle{
        font-weight: 400;
        text-align: justify;
    }
</style>