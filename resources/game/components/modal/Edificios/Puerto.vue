<template>
    <div class="box pt-2 pb-5">
        <div class="gtitle text-center">{{$t('building.port.speedTitle')}}</div>
        <div>{{$t('building.port.speedText')}}</div>
        <div class="d-flex justify-content-center mt-3">
            <div><img class="puerto" :src="require('Img/ciudad/16.png')"></div>
            <div>{{speed}} {{$t('building.port.speedMin')}}</div>
        </div>

        <div class="gtitle text-center mt-3">{{$t('building.port.tradeShipBuyTitle')}}</div>
        <div>{{$t('building.port.tradeShipBuyText')}}</div>
        <div class="d-flex justify-content-center">
            <div class="d-flex justify-content-center position-relative">
                <div class="mb-2"><img :src="require('Img/icon/ship_transport.png')"></div>
                <div class="valores">{{trade_ship}}/180</div>
            </div>
            <div class="d-flex align-items-center">
                <div class="text-center">
                    <div class="text-center mb-2">{{$t('other.cost')}}: <img :src="require('Img/icon/icon_gold.png')"> {{$money(goldCost)}}</div>
                    <div v-if='gold>goldCost' class="btnGeneral py-2 px-3" @click='comprar'>{{$t('building.port.tradeShipBuyBtn')}}</div>
                    <div v-else class="text-danger">
                        <div>{{$t('building.port.tradeShipBuyMissing1')}}</div>
                        <div>{{$t('building.port.tradeShipBuyMissing2',{goldMissing:$money(goldMissing)})}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import $config from 'Stores/config'
import $resources from 'Stores/resources'

export default {
    name: 'Puerto',
    props:['data'],
    methods:{
        comprar(){
            axios.post('user/buyTradeShip')
            .then(res =>{
                if(res.data!='ok'){
                    $notification.commit('show',{advisor:1,type:false,message:res.data});
                }else{
                    $resources.commit('buyTradeShip',{goldCost:this.goldCost});
                    $notification.commit('show',{advisor:1,type:true})
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:1,type:false,message:err});
            })
        }
    },
    computed:{
        goldCost(){
            var level = this.trade_ship+1;
            if(level<10)
            {
                var goldCost = level*490;
            }
            else
            {
                var coeficiente = (level/1000)+1.8;
                var goldCost = this.$floor(Math.pow(level,coeficiente)*(80+(level/10)));
            }
            return goldCost;
        },
        goldMissing(){
            return this.goldCost - this.gold;
        },
        gold(){
            return $resources.state.userResources.gold;
        },
        speed(){
            return this.$floor(this.load_speed_base + (this.level * this.load_speed));
        },
        level(){
            return this.data.level - 1;
        },
        load_speed_base(){
            return $config.state.world.load_speed_base;
        },
        load_speed(){
            return $config.state.world.load_speed;
        },
        trade_ship(){
            return $resources.state.userResources.trade_ship;
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{font-size: 0.83rem;
    line-height: 0.83rem;}
    .puerto{
        width: 40px;
    }
</style>
