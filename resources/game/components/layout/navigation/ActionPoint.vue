<template>
    <div class="flex-1 d-flex box" :title="$t('resources.apoint')">
        <div class="action"></div>
        <div>{{data.point}}/{{data.point_max}}</div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'

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
                this.data = res.data;
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
            this.getActionPoint()
        }
    },
    mounted(){
        $store.subscribe(action => {
            if (action.type === 'reloadActionPoint') {
                this.getActionPoint();
            }
        });
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