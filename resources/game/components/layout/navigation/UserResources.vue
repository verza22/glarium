<template>
    <div class="flex-1 box">
        <a href="https://www.patreon.com/glarium" target="_blank"><div class="btn-premium" :title="$t('options.userResources.patreonTitle')">
            <div class="premium">{{$t('options.userResources.patreon')}}</div>
        </div></a>
        <div class="btn-ships" :title="$t('options.userResources.ships')">
            <div class="ships">{{trade_ship_available}}/{{trade_ship}}</div>
        </div>
        <div class="btn-gold" :title="$t('options.userResources.gold')">
            <div class="gold">{{$money(gold)}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'
import $resources from 'Stores/resources'

export default {
    name:'UserResources',
    methods:{
        getResources(){
            axios("user/getUserResources")
            .then(res => {
                //this.resources = res.data;
                $resources.commit('updateUserResources',res.data);
            })
        }
    },
    computed:{
        trade_ship(){
            return $resources.state.userResources.trade_ship;
        },
        trade_ship_available(){
            return $resources.state.userResources.trade_ship_available;
        },
        gold(){
            return $resources.state.userResources.gold;
        }
    },
    mounted(){
        this.getResources();
        $store.subscribe(action => {
            if (action.type === 'reloadUserResources') {
                this.getResources();
            }
        });
    }
}
</script>

<style lang="scss" scoped>
    .box{
        user-select: none;
    }
    .btn-ships{
        background-image: url('~Img/icon/ships.jpg');
    }
    .btn-gold{
        background-image: url('~Img/icon/gold.jpg');
    }
    .btn-ships,.btn-gold,.btn-premium{
        width: 110px;
        height: 30px;
        cursor: pointer;
    }
    .gold,.ships{
        padding: 5px 10px 5px 42px;
        text-align: right
    }
    .btn-gold:hover,.btn-ships:hover{
        background-position-y: 58px;
    }
    .btn-premium{
        background-image: url('~Img/icon/premium.png');
        background-size: cover;
    }
    .premium{
        color: white;
        padding: 6px;
        text-align: center;
    }
</style>
