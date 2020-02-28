<template>
    <div class="dt_container">
        <div class="dt_box">
            <div class="dt_header d-flex">
                <div class="flex-1 mr-2">Cargamento</div>
                <div class="btn-close" @click="close(movement)"></div>
            </div>
            <div class="d-flex">
                <div class="dt_item px-0">
                    <div class="mb-1 my-1"><img class="ship" :src="require('Img/icon/ship_transport.png')"></div>
                    <div>{{movement.trade_ship}}</div>
                </div>
                <div class="dt_item" v-if="movement.resources.wood>0">
                    <div class="dt_resource"><img :src="require('Img/icon/icon_wood.png')"></div>
                    <div>{{$money(movement.resources.wood)}}</div>
                </div>
                <div class="dt_item" v-if="movement.resources.wine>0">
                    <div class="dt_resource"><img :src="require('Img/icon/icon_wine.png')"></div>
                    <div>{{$money(movement.resources.wine)}}</div>
                </div>
                <div class="dt_item" v-if="movement.resources.marble>0">
                    <div class="dt_resource"><img :src="require('Img/icon/icon_marble.png')"></div>
                    <div>{{$money(movement.resources.marble)}}</div>
                </div>
                <div class="dt_item" v-if="movement.resources.glass>0">
                    <div class="dt_resource"><img :src="require('Img/icon/icon_glass.png')"></div>
                    <div>{{$money(movement.resources.glass)}}</div>
                </div>
                <div class="dt_item" v-if="movement.resources.sulfur>0">
                    <div class="dt_resource"><img :src="require('Img/icon/icon_sulfur.png')"></div>
                    <div>{{$money(movement.resources.sulfur)}}</div>
                </div>
                <div class="dt_item" v-if="movement.resources.gold>0">
                    <div class="dt_resource"><img :src="require('Img/icon/icon_gold.png')"></div>
                    <div>{{$money(movement.resources.gold)}}</div>
                </div>
                <div v-for="(unit,i) in movement.resources.units" :key="i">
                    <div class="dt_item" v-if="unit.cant>0">
                        <div class="unit my-1" :class="'unit_'+unit.unit_id"></div>
                        <div>{{unit.cant}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Recursos',
    props:['movement','close']
}
</script>

<style lang="scss" scoped>
    @import '~Sass/units';
    .dt_container{
        position: absolute;
        left: 35px;
        top: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        align-items: center;
    }
    .dt_box{
        background-color: #FAE0AE;
        border: 1px solid #E4B873;
        color: #906646;
        padding: 5px;
    }
    .dt_header{
        align-items: center;
        margin-bottom: 5px;
    }
    .btn-close{
        position: static;
    }
    .ship{
        width: 40px;
    }
    .dt_item{
        background: #FDF7DD;
        padding: 2px 5px;
        display: flex;
        flex-direction: column;
    }
    .dt_resource{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
    }
</style>
