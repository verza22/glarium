<template>
    <div>
        <div class="forest" :title='$t(`island.forest`)+` `+data.level_forest' @click='openForest'>
            <div class="forest_active"></div>
        </div>
        <div class="mine" :class='"mine_"+data.type' :title='mineTitle(data.type)'>
            <div :class='"mine_"+data.type+"_active"'></div>
        </div>
    </div>
</template>

<script>
import $modal from "Stores/modal.js";
import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'

export default {
    name:'Resources',
    props:['data'],
    methods:{
        mineTitle(type){
            var title = '';
            switch(type){
                case 1:
                    title += this.$t('island.vines')
                break;
                case 2:
                    title += this.$t('island.quarry')
                break;
                case 3:
                    title += this.$t('island.crystal')
                break;
                case 4:
                    title += this.$t('island.sulfur')
                break;
            }
            title += ' '+this.data.level_mine;
            return title;
        },
        openForest(){
            axios.post('island/donation/'+this.$route.params.island,{
                type:1
            })
            .then(res =>{
                $modal.commit('openModal',{type:2,info:res.data})
            })
            .catch(err =>{
                catchAxios(err)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .forest{
        background-image: url('~Img/island/forest.png');
        width: 98px;
        height: 74px;
        position: absolute;
        top: 460px;
        right: 475px;
    }
    .forest_active{
        background-image: url('~Img/island/forest_active.png');
        width: 103px;
        height: 74px;
        position: relative;
        right: 4px;
        bottom: 6px;
        display: none;
    }
    .forest:hover .forest_active{
        display: block;
    }
    .mine{
        position: absolute;
        top: 486px;
        right: 648px;
    }
    .mine_1{
        background-image: url('~Img/island/resource_1.png');
        width: 88px;
        height: 61px;
    }
    .mine_1_active{
        background-image: url('~Img/island/resource_1_active.png');
        display: none;
        width: 88px;
        height: 61px;
    }
    .mine_1:hover .mine_1_active{
        display: block;
    }
    .mine_2{
        background-image: url('~Img/island/resource_2.png');
        width: 105px;
        height: 85px;
    }
    .mine_2_active{
        background-image: url('~Img/island/resource_2_active.png');
        display: none;
        width: 105px;
        height: 85px;
    }
    .mine_2:hover .mine_2_active{
        display: block;
    }
    .mine_3{
        background-image: url('~Img/island/resource_3.png');
        width: 114px;
        height: 85px;
    }
    .mine_3_active{
        background-image: url('~Img/island/resource_3_active.png');
        display: none;
        width: 114px;
        height: 85px;
    }
    .mine_3:hover .mine_3_active{
        display: block;
    }
    .mine_4{
        background-image: url('~Img/island/resource_4.png');
        width: 112px;
        height: 93px;
    }
    .mine_4_active{
        background-image: url('~Img/island/resource_4_active.png');
        display: none;
        width: 120px;
        height: 103px;
    }
    .mine_4:hover .mine_4_active{
        display: block;
    }
</style>