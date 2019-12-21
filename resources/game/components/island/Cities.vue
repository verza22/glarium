<template>
    <div class="objectContainer">
        <div class="object" 
        :style="{top:object.top,left:object.left}"
        v-for="(object,index) in objects"
        :key='index'
        >
            <div class="d-flex justify-content-center" v-if='checkCity(index)'>
                <div class="city" :class='cities[index].type ? "blue" : "red"'></div>
                <div class="name">{{cities[index].name}}</div>
            </div>
            <div class="flag" v-else></div>
        </div>
    </div>
</template>

<script>


export default {
    name:'Ciudades',
    props:['cities'],
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
            return this.cities.some(x =>{
                return x.position == index
            });
        }
    }
}
</script>

<style lang="css" scoped>
    .object{
        position: absolute;
        cursor: pointer;
        width: 104px;
        height: 70px;
    }
    .blue{
        background-image: url(/img/island/city_blue.png);
    }
    .red{
        background-image: url(/img/island/city_red.png);
    }
    .city{
        background-position: -3px 0px;
        width: 70;
        height: 70;
        margin: 0 15;
    }
    .flag{
        background-image: url(/img/island/flag.png);
        width: 70px;
        height: 70px;
        margin: 0 35;
        background-repeat: no-repeat;
        background-position-x: right;
    }
    .objectContainer{
        position:relative;
    }
    .name{
        background-image: url(/img/island/name1.png);
        position: absolute;
        bottom: -25px;
        padding: 3px 4px;
        background-repeat: repeat no-repeat;
        background-size: contain;
        font-size: 0.85rem;
    }
    .name::after {
        background-image: url(/img/island/name2.png);
        width: 12px;
        height: 26px;
        content: '';
        position: absolute;
        left: -10px;
        top: 0px;
        background-repeat: repeat no-repeat;
        background-size: cover;
    }
    .name::before {
        background-image: url(/img/island/name3.png);
        width: 12px;
        height: 26px;
        content: '';
        position: absolute;
        right: -10px;
        top: 0px;
        background-repeat: repeat no-repeat;
        background-size: cover;
    }
</style>