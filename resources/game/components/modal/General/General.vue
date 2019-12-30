<template>
    <div class="mBorder">
        <Ventana1 :close='close' titulo="Milicia">
            <div class="box">
                <div class="d-flex">
                    <div class="selectContainer" :class="type==0 ? 'active' : ''" title="Mensajes Recibidos" @click='change(0)'>
                        <div class="imagen"></div>
                        <div class="texto">Movimientos ({{movements.length}})</div>
                    </div>
                    <div class="selectContainer" :class="type==1 ? 'active' : ''" title="Mensajes Enviados" @click='change(1)'>
                        <div class="imagen"></div>
                        <div class="texto">Informes de guerra (0)</div>
                    </div>
                </div>
                <Movimientos :movements='movements' v-if="movements.length>0"></Movimientos>
                <div v-else class="nomessage">{{$t('messages.noMessage')}}</div>
            </div>
        </Ventana1>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Movimientos from 'Components/modal/General/Movimientos.vue'
import $movement from 'Stores/movement'

export default {
    name: 'General',
    props:['close'],
    components:{
        Ventana1,
        Movimientos
    },
    data(){
        return {
            type:0
        }
    },
    computed:{
        movements(){
            return $movement.state.movements;
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    .imagen{
        background-image: url('~Img/icon/schriftrolle_closed.png');
        width: 17px;
        height: 17px;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-block;
        margin-top: auto;
        margin-bottom: auto;
    }
    .active .imagen{
        background-image: url('~Img/icon/schriftrolle_offen.png');
    }
    .active{
        background: #dfc594;
    }
    .texto{
        display: inline-block;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 5px;
    }
    .selectContainer{
        display: flex;
        justify-content: center;
        flex: 1;
        padding: 5px 0px;
        cursor: pointer;
    }
    .nomessage{
        text-align: center;
        margin: 20px 0px 10px;
    }
</style>
