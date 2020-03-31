<template>
    <div class="flex-3 d-flex btn-game">
        <div class="flex-1 btn-world" @click='toWorld()' :title="$t('options.navigation.worldTitle')">
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
import $city from 'Stores/city'
import $modal from 'Stores/modal'
import $notification from 'Stores/notification'

export default {
    name:'Buttons',
    methods:{
        toWorld(){
            //Verificamos que no en el mapa mundo
            if(this.$route.name=='World'){
                return;
            }
            var x = this.island.x
            var y = this.island.y
            if(x==undefined||y==undefined){
                x = this.city.x
                y = this.city.y
            }
            axios('world/'+x+'/'+y)
            .then(res =>{
                $modal.commit('changeRoute')
                this.$router.push({ name: 'World', params: { x:x,y:y,data: res.data }})
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        },
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
                if(this.$route.name=='Island'){
                    $city.commit('setIsland',{island:res.data})
                }
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
            $modal.commit('changeRoute')
            this.$router.push({ name: 'City', params: { city:this.city_id}})
        }
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        },
        city(){
            return $city.state.city;
        },
        island_id(){
            return $city.state.city.island_id;
        },
        island(){
            return $city.state.island;
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
        background-image: url('~Img/icon/btn_world.png');
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
        bottom: 2px;
        height: 56px;
    }
    .btn-city:hover,.btn-island:hover,.btn-world:hover{
        background-position-y: center;
    }
</style>
