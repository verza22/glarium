<template>
    <div class="flex-1 d-flex box" :title="$t('resources.apoint')">
        <div class="action"></div>
        <div>{{apoint}}/{{apoint_max}}</div>
    </div>
</template>

<script>
import axios from 'axios'
import $city from 'Stores/city'
import $resources from 'Stores/resources'

export default {
    name:'ActionPoint',
    data(){
        return {
            data:{}
        }
    },
    methods:{
        getActionPoint(){
            axios("city/getActionPoint/" + this.city_id)
            .then(res => {
                $resources.commit('setApoint',{apoint:res.data.point,apoint_max:res.data.point_max})
            })
        },
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        },
        apoint(){
            return $resources.state.apoint;
        },
        apoint_max(){
            return $resources.state.apoint_max;
        }
    },
    watch:{
        city_id(newval){
            this.getActionPoint()
        }
    }
}
</script>

<style lang="scss" scoped>
.action{
    background-image: url('~Img/icon/action_point.png');
    width: 25px;
    height: 25px;
}
.box{
    user-select: none;
    justify-content: center;
    align-items: center;
}
</style>
