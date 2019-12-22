<template>
    <div class="flex-1 d-flex resources">
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.wood')">
                <img class="mr-1" :src="require('Img/icon/icon_wood.png')">
                <span>{{$floor(resources.wood)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.wine')">
                <img class="mr-1" :src="require('Img/icon/icon_wine.png')">
                <span>{{$floor(resources.wine)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.marble')">
                <img class="mr-1" :src="require('Img/icon/icon_marble.png')">
                <span>{{$floor(resources.marble)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.glass')">
                <img class="mr-1" :src="require('Img/icon/icon_glass.png')">
                <span>{{$floor(resources.glass)}}</span>
            </div>
        </div>
        <div class="flex-1 d-flex">
            <div class="d-flex align-items-center" :title="$t('resources.sulfur')">
                <img class="mr-1" :src="require('Img/icon/icon_sulfur.png')">
                <span>{{$floor(resources.sulfur)}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'

export default {
    name:'Resources',
    data(){
        return {
            resources:{}
        }
    },
    methods:{
        getResources(){
            axios("city/getResources/" + this.city_id)
            .then(res => {
                this.resources = res.data;
            })
        },
    },
    computed:{
        city_id(){
            return $store.state.city_id;
        }
    },
    watch:{
        city_id(newval){
            this.getResources()
        }
    },
    mounted(){
        $store.subscribe(action => {
            if (action.type === 'reloadResources') {
                this.getResources();
            }
        });
    }
}
</script>

<style lang="scss" scoped>
.resources{
    padding-left: 5px;
    user-select: none;
}
</style>