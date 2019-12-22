<template>
    <div class="flex-1 box">
        <div class="btn-premium" :title="$t('options.userResources.premiumTitle')">
            <div class="premium">{{$t('options.userResources.premiumActive')}}</div>
        </div>
        <div class="btn-ships" :title="$t('options.userResources.ships')">
            <div class="ships">{{resources.trade_ship}}/{{resources.trade_ship_available}}</div>
        </div>
        <div class="btn-gold" :title="$t('options.userResources.gold')">
            <div class="gold">{{$floor(resources.gold)}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'

export default {
    name:'UserResources',
    data(){
        return {
            resources:{}
        }
    },
    methods:{
        getResources(){
            axios("user/getUserResources")
            .then(res => {
                this.resources = res.data;
            })
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