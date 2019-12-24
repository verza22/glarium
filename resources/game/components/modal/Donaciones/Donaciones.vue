<template>
    <div class="mBorder">
        <Ventana1 :close='close' :titulo="getTitle()">
            <IslandResources :data='info'></IslandResources>
        </Ventana1>
        <Ventana2 :titulo="getTitle()">
            <IslandDonation :type='info.type' :reloadDonation='reloadDonation' :data='info.info'></IslandDonation>
        </Ventana2>
    </div>
</template>

<script>
import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Ventana2 from 'Components/modal/Ventanas/Ventana2.vue'
import IslandResources from 'Components/modal/Donaciones/IslandResources.vue'
import IslandDonation from 'Components/modal/Donaciones/IslandDonation.vue'
import $modal from 'Stores/modal.js'

export default {
    name:'Donaciones',
    components:{
        Ventana1,
        Ventana2,
        IslandResources,
        IslandDonation
    },
    props:['infop','close'],
    data(){
        return {
            info:{}
        }
    },
    methods:{
        reloadDonation(){
            //Actualizamos la donacion de la isla
            axios.post('island/donation/'+this.$route.params.island,{
                type:this.info.info.type
            })
            .then(res =>{
                res.data.info.type = this.info.info.type
                res.data.info.island_type = this.info.info.island_type
                this.info = res.data;
            })
            .catch(err =>{
                catchAxios(err)
            })
        },
        getTitle(){
            if(this.info.info.type==1){
                return this.$t('island.forest');
            }else{
                switch(this.info.info.island_type){
                    case 1:
                        return this.$t('island.vines');
                    break;
                    case 2:
                        return this.$t('island.quarry');
                    break;
                    case 3:
                        return this.$t('island.crystal');
                    break;
                    case 4:
                        return this.$t('island.sulfur');
                    break;
                }
            }
        }
    },
    beforeMount(){
        this.info = this.infop
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>