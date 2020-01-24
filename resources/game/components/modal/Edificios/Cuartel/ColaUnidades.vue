<template>
    <div class="box py-0">
        <div class="mb-1" v-if="regimentTails.length>0">
            <hr class="mt-0">
            <div class="gtitle mb-2 text-center">Listado de construcción</div>
            <div v-for="index in 3" :key="index">
                <div v-if="checkUnits(index-1)">
                    <div>
                        <div class="mb-2 text-center">En construcción: {{getTime(index-1)}}</div>
                    </div>
                    <div class="d-flex">
                        <div v-for="(unit,index2) in getUnits(index-1)" :key="index2">
                            <div><div class="unit mx-1" :class="'unit_'+unit.unit_id"></div></div>
                            <div class="text-center cant">{{unit.cant}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment"
import $city from 'Stores/city'
import $unit from 'Stores/unit'
import $store from "Stores/store"

export default {
    name: 'ColaUnidades',
    methods:{
        checkUnits(index){
            return this.regimentTails.filter(regimentTail => regimentTail.tail == index).length>0
        },
        getUnits(index){
            return this.regimentTails.filter(regimentTail => regimentTail.tail == index)
        },
        getTime(index){
            var regiments = this.regimentTails.filter(regimentTail => regimentTail.tail == index)
            var constructed_at = regiments[0].constructed_at
            var seconds = moment.duration(moment(constructed_at).diff(moment(this.now))).asSeconds()
            return seconds>0 ? this.$sectotime(seconds) : '0s'
        }
    },
    computed:{
        now(){
            return $store.state.now;
        },
        city_id(){
            return $city.state.city_id;
        },
        regimentTails(){
            return $unit.getters.getTails(this.city_id);
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/units';
    .box{
        font-size: 0.83rem
    }
    .cant{
        font-size: 0.7rem
    }
</style>
