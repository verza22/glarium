<template>
    <div class="mBorder">
        <Ventana1 :close='close' :titulo="$t('island.forest')">
            <IslandResources :data='info'></IslandResources>
        </Ventana1>
        <Ventana2 :titulo="$t('island.forest')">
            <IslandDonation :reloadDonation='reloadDonation' :data='info.info'></IslandDonation>
        </Ventana2>
    </div>
</template>

<script>
import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Ventana2 from 'Components/modal/Ventanas/Ventana2.vue'
import IslandResources from 'Components/modal/Bosque/IslandResources.vue'
import IslandDonation from 'Components/modal/Bosque/IslandDonation.vue'
import $modal from 'Stores/modal.js'

export default {
    name:'Bosque',
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
                type:1
            })
            .then(res =>{
                this.info = res.data;
            })
            .catch(err =>{
                catchAxios(err)
            })
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