<template>
    <div class="flex-1 box position-relative">
        <div class="nav nav-selected" :title="$t('options.navigation.showCities')" @click='showCities'>
            <div class="city">{{getSelected()}}</div>
        </div>
        <div class="nav-other-container" v-if="show">
            <div class="nav nav-other" v-for='(city,i) in getOther()' :key='i'>
                <div class="city">{{`[${city.x}:${city.y}] ${city.name}`}}</div>
            </div>
            <div class="nav-footer"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $store from 'Stores/store.js'

export default {
    name:'Cities',
    data(){
        return {
            data:[],
            show:false
        }
    },
    methods:{
        showCities(){
            this.show = !this.show;
        },
        getCities(){
            axios("city/getCities")
            .then(res => {
                this.data = res.data;
                this.checkSelected()
            })
        },
        checkSelected(){
            this.data.forEach(x =>{
                if(x.id == this.city_id){
                    x.selected = true;
                }else{
                    x.selected = false;
                }
            })
        },
        getOther(){
            return this.data.filter(x =>{
                return !x.selected;
            })
        },
        getSelected(){
            if(this.data.length>0){
                var city = this.data.filter(x =>{
                    return x.selected;
                })[0]
                return `[${city.x}:${city.y}] ${city.name}`;
            } 
        }
    },
    computed:{
        city_id(){
            return $store.state.city_id;
        }
    },
    mounted(){
        this.getCities()
        $store.subscribe(action => {
            if (action.type === 'reloadCities') {
                this.getCities();
            }
        });
    }
}
</script>

<style lang="scss" scoped>
.box{
    user-select: none;
}
.nav{
    height: 23px;
    background-size: cover;
    cursor: pointer;
}
.nav-selected{
    background-image: url('~Img/icon/navigation-selected.jpg');
}
.nav-other-container{
    position: absolute;
    width: 100%;
}
.nav-other{
    background-image: url('~Img/icon/navigation-other.jpg');
    background-position-y: 28px;
}
.nav-other:hover{
    background-position-y: 52px;
}
.footer{
    background-image: url('~Img/icon/navigation-other.jpg');
    background-position-y: bottom;
    height: 28px;
}
.nav-footer{
    background-image: url('~Img/icon/navigation-footer.jpg');
    height: 5px;
}
.nav-selected:hover{
    background-position-y: -23px;
}
.city{
    position: relative;
    top: 2px;
    left: 6px;
}
</style>