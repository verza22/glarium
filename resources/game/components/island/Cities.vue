<template>
    <div class="objectContainer">
        <div class="object"
        :style="{top:object.top+'px',left:object.left+'px'}"
        v-for="(object,index) in objects"
        :key='index'
        >
            <div class="d-flex justify-content-center" :title='getCity(index).name' v-if='checkCity(index)' @click='openCityInfo(getCity(index),index)'>
                <div class="city_hover" :class="[getActive(index),colorCity(index)]" ></div>
                <div class="city" :class='colorCity(index)' v-if='getCity(index).constructed_at != null'></div>
                <div class="city_constr" v-else></div>
                <div class="valores">{{getCity(index).name}}</div>
            </div>
            <div class="flag" v-else :title="$t('colonize.question')" @click='openColonize(index)'></div>
        </div>
    </div>
</template>

<script>
import $modal from 'Stores/modal'
import $city from 'Stores/city'

export default {
    name:'Ciudades',
    props:['data'],
    data(){
        return {
            selectedIndex:-1,
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
                {top:680,left:825},
                {top:660,left:650},
                {top:690,left:475},
                {top:740,left:235},
                {top:515,left:505}
            ]
        }
    },
    methods:{
        colorCity(index){
            var city = this.getCity(index)
            return [city.type ? "blue" : "red", this.getLevel(city.level)];
        },
        getLevel(level){
            switch(level){
                case 1:
                    return 'level_1';
                break;
                case 2:
                case 3:
                    return 'level_2';
                break;
                case 4:
                case 5:
                case 6:
                    return 'level_4';
                break;
                case 7:
                case 8:
                case 9:
                    return 'level_7';
                break;
                case 10:
                case 11:
                case 12:
                    return 'level_10';
                break;
                case 13:
                case 14:
                case 15:
                    return 'level_13';
                break;
                case 16:
                case 17:
                    return 'level_16';
                break;
                default:
                    return 'level_18';
                break;
            }
        },
        getActive(index){
            return index==this.selectedIndex ? 'active' : ''
        },
        checkCity(index){
            var cities =  this.data.cities.filter(x =>{
                return x.position == index
            });
            return cities.length>0
        },
        getCity(index){
            return this.data.cities.filter(x =>{
                return x.position == index
            })[0];
        },
        getCityById(city_id){
            return this.data.cities.filter(x =>{
                return x.city_id == city_id
            })[0];
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
        openCityInfo(city,index){
            if(city.constructed_at==null){
                return
            }
            this.selectedIndex = index
            $modal.commit('openModal',{
                type:4,
                info:{
                    city:city
                }
            })
        },
        focusCity(city_id){
            var city = this.getCityById(city_id)
            if(city!=undefined){
                this.selectedIndex = city.position
                $modal.commit('openModal',{
                    type:4,
                    info:{
                        city:city
                    }
                })
            }
        }
    },
    mounted(){
        $city.subscribe((action,state) => {
            if (action.type === "setFocusCity") {
                if(state.focusCity!=-1){
                    this.focusCity(state.focusCity)
                }
            }
        });
    }
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
    .city_hover.active{
        z-index: 3;
        background-position-y: -3px;
    }
    .blue.active{
        background-image: url('~Img/island/city_blue_hover.png');
    }
    .red.active{
        background-image: url('~Img/island/city_red_hover.png');
    }
    .city,.city_hover{
        background-position: -3px;
        width: 70px;
        height: 70px;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
    }
    .level_2{
        background-position: -76px;
    }
    .level_4{
        background-position: -152px;
    }
    .level_7{
        background-position: -228px;
    }
    .level_10{
        background-position: -305px;
    }
    .level_13{
        background-position: -380px;
    }
    .level_16{
        background-position: -453px;
    }
    .level_18{
        background-position: -530px;
    }
    .city_constr{
        background-image: url('~Img/island/city_constr.png');
        width: 70px;
        height: 70px;
        margin: 0px 15px;
        background-repeat: no-repeat;
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
