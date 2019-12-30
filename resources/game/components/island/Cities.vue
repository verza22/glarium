<template>
    <div class="objectContainer">
        <div class="object"
        :style="{top:object.top+'px',left:object.left+'px'}"
        v-for="(object,index) in objects"
        :key='index'
        >
            <div class="d-flex justify-content-center" :title='data.cities[index].name' v-if='checkCity(index)' @click='openCityInfo(data.cities[index])'>
                <div class="city" :class='data.cities[index].type ? "blue" : "red"'></div>
                <div class="valores">{{data.cities[index].name}}</div>
            </div>
            <div class="flag" v-else :title="$t('colonize.question')" @click='openColonize(index)'></div>
        </div>
    </div>
</template>

<script>
import $modal from 'Stores/modal'

export default {
    name:'Ciudades',
    props:['data'],
    data(){
        return {
            objects:[
                {top:575,left:250},
                {top:480,left:185},
                {top:380,left:125},
                {top:235,left:295},
                {top:155,left:415},
                {top:135,left:660},
                {top:210,left:830},
                {top:275,left:1025},
                {top:390,left:1185},
                {top:640,left:1155},
                {top:570,left:950},
                {top:700,left:825},
                {top:660,left:650},
                {top:690,left:475},
                {top:740,left:235},
                {top:515,left:505}
            ]
        }
    },
    methods:{
        checkCity(index){
            return this.data.cities.some(x =>{
                return x.position == index
            });
        },
        openColonize(index){
            var ojb = {
                id:this.data.id,
                name:this.data.name,
                position:index,
                x: this.data.x,
                y: this.data.y
            }
            $modal.commit('openModal',{
                type:6,
                info:ojb
            })
        },
        openCityInfo(city){
            $modal.commit('openModal',{
                type:4,
                info:{
                    city:city
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .object{
        position: absolute;
        cursor: pointer;
        width: 104px;
        height: 70px;
    }
    .blue{
        background-image: url('~Img/island/city_blue.png');
    }
    .red{
        background-image: url('~Img/island/city_red.png');
    }
    .city{
        background-position: -3px 0px;
        width: 70px;
        height: 70px;
        margin: 0px 15px;
    }
    .flag{
        background-image: url('~Img/island/flag.png');
        width: 70px;
        height: 70px;
        margin: 0px 35px;
        background-repeat: no-repeat;
        background-position-x: right;
    }
    .objectContainer{
        position:relative;
    }
</style>
