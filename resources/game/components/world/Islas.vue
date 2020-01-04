<template>
    <div>
        <div v-for="(island,index) in data" :key='index'>
            <div class="island"
            :title='getTitle(island)'
            :class='checkActive(island)'
            @click='select(island)'
            :style="{
                width:wsize+'px',
                height:hsize+'px',
                top:(hsize*island.y)+'px',
                left:(wsize*island.x)+'px'
            }"
            ></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $modal from 'Stores/modal'
import $notification from 'Stores/notification'

export default {
    name: 'Islas',
    props:['data','wsize','hsize','x','y'],
    data(){
        return {
            xActive:0,
            yActive:0
        }
    },
    methods:{
        getTitle(island){
            return `${island.name} [${island.x}:${island.y}]`
        },
        checkActive(island){
            if(this.xActive==island.x&&this.yActive==island.y){
                return 'active'
            }
        },
        select(island){
            console.log('x=>'+island.x+'||y=>'+island.y)
            if(this.xActive==island.x&&this.yActive==island.y){
                axios('island/'+island.id)
                .then(res =>{
                    $modal.commit('changeRoute')
                    this.$router.push({ name: 'Island', params: { island:island.id,data: res.data }})
                })
                .catch(err => {
                    $notification.commit('show',{advisor:1,type:false,message:err});
                });
            }else{
                this.xActive = island.x
                this.yActive = island.y
                this.$router.push({ name: 'World', params: { x:island.x, y:island.y}})
            }
        }
    },
    beforeMount(){
        this.xActive = this.x
        this.yActive = this.y
    }
}
</script>

<style lang="scss" scoped>
    .island{
        background-image: url('~Img/world/island.png');
        position: absolute;
        top: 200px;
        left: 200px;
    }
    .active{
        background-image: url('~Img/world/island_active.png');
    }
</style>
