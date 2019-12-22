<template>
    <div class="flex-1 navigation-box">
        <div class="navigation" :title="$t('options.navigation.showCities')">
            <div class="city">{{getSelected()}}</div>
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
.navigation-box{
    padding: 1px 0px 0px 4px;
}
.navigation{
    background-image: url('~Img/icon/navigation.jpg');
    height: 23px;
    background-size: cover;
    cursor: pointer;
}
.navigation:hover{
    background-position-y: -23px;
}
.city{
    position: relative;
    top: 2px;
    left: 6px;
}
</style>