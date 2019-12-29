<template>
    <div class="flex-3 d-flex btn-game">
        <div class="flex-1 btn-world" :title="$t('options.navigation.worldTitle')">
            <div class="btn-game-text">{{$t('options.navigation.world')}}</div>
        </div>
        <div class="flex-1 btn-island" @click='toIsland()' :title="$t('options.navigation.islandTitle')">
            <div class="btn-game-text">{{$t('options.navigation.island')}}</div>
        </div>
        <div class="flex-1 btn-city" @click='toCity()' :title="$t('options.navigation.cityTitle')">
            <div class="btn-game-text">{{$t('options.navigation.city')}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store'
import $modal from 'Stores/modal'
import $notification from 'Stores/notification'

export default {
    name:'Buttons',
    methods:{
        toIsland(){
            //Verificamos que no este en la misma isla
            if(this.$route.name=='Island'){
                if(this.$route.params.island==this.island_id){
                    return;
                }
            }
            axios('island/'+this.island_id)
            .then(res =>{
                $modal.commit('changeRoute')
                this.$router.push({ name: 'Island', params: { island:this.island_id,data: res.data }})
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        },
        toCity(){
            //Verificamos que no este en la misma ciudad
            if(this.$route.name=='City'){
                if(this.$route.params.city==this.city_id){
                    return;
                }
            }
            axios("building/" + this.city_id)
            .then(res => {
                $modal.commit('changeRoute')
                this.$router.push({ name: 'City', params: { city:this.city_id,buildings: res.data }})
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        }
    },
    computed:{
        city_id(){
            return $store.state.city_id;
        },
        island_id(){
            return $store.state.city_island_id;
        }
    },
}
</script>

<style lang="scss" scoped>
    .btn-game{
        padding: 0px 4px;
        font-size: 11px;
        user-select: none;
    }
    .btn-game-text{
        position: absolute;
        bottom: 1px;
        width: 100%;
        text-align: center;
    }
    .btn-world{
        background-image: url('~Img/icon/btn_world.jpg');
        background-repeat: no-repeat;
        position: relative;
        cursor: pointer;
        height: 53px;
    }
    .btn-island{
        background-image: url('~Img/icon/btn_island.jpg');
        background-repeat: no-repeat;
        position: relative;
        cursor: pointer;
        height: 53px;
    }
    .btn-city{
        background-image: url('~Img/icon/btn_city.png');
        background-repeat: no-repeat;
        position: relative;
        cursor: pointer;
        bottom: 4px;
        height: 58px;
    }
    .btn-city:hover,.btn-island:hover,.btn-world:hover{
        background-position-y: center;
    }
</style>
