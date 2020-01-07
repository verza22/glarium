<template>
    <div class="flex-1 box position-relative">
        <div class="nav nav-selected" :title="$t('options.navigation.showCities')" @click='showCities'>
            <div class="city">{{getSelected()}}</div>
        </div>
        <div class="nav-other-container" v-if="show">
            <div class="nav nav-other" v-for='(city,i) in getOther()' :key='i' @click='changeCity(city)'>
                <div class="city">{{`[${city.x}:${city.y}] ${city.name}`}}</div>
            </div>
            <div class="nav-footer"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $city from 'Stores/city'

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
                $city.commit('setCities',{cities:res.data});
                this.checkSelected()
            })
        },
        checkSelected(){
            var aux = [...this.data]
            aux.forEach(x =>{
                if(x.id == this.city_id){
                    x.selected = true
                    $city.commit('changeCity',{city:x})
                }else{
                    x.selected = false
                }
            })
            this.data = aux
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
        },
        changeCity(city){
            this.show = false;
            $city.commit('setCityId',{city_id:city.id});
            this.$router.push({ name: 'City', params: { city:city.id}})
        }
    },
    computed:{
        city_id(){
            return $city.state.city_id;
        },
    },
    watch:{
        city_id(){
           this.checkSelected()
        }
    },
    mounted(){
        this.getCities()
        $city.subscribe(action => {
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
