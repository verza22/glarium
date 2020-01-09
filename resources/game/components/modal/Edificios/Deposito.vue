<template>
    <div class="box">
        <div class="gtitle text-center mt-2 mb-3">{{$t('warehouse.title')}}</div>
        <div class="d-flex text-center fondo py-1">
            <div class="flex-1">{{$t('warehouse.safe')}}</div>
            <div class="flex-1">{{$t('warehouse.notSafe')}}</div>
            <div class="flex-1">{{$t('warehouse.total')}}</div>
            <div class="flex-1">{{$t('warehouse.capacity')}}</div>
        </div>
        <div class="d-flex p-1">
            <div class="flex-1">
                <wood :visible='true' :cant='safe'></wood>
            </div>
            <div class="flex-1">
                <wood :visible='true' :cant='woodSafe'></wood>
            </div>
            <div class="flex-1">
                <wood :visible='true' :cant='wood'></wood>
            </div>
            <div class="flex-1">
                <wood :visible='true' :cant='max_capacity'></wood>
            </div>
        </div>
        <div class="d-flex p-1">
            <div class="flex-1">
                <wine :visible='true' :cant='safe'></wine>
            </div>
            <div class="flex-1">
                <wine :visible='true' :cant='wineSafe'></wine>
            </div>
            <div class="flex-1">
                <wine :visible='true' :cant='wine'></wine>
            </div>
            <div class="flex-1">
                <wine :visible='true' :cant='max_capacity'></wine>
            </div>
        </div>
        <div class="d-flex p-1">
            <div class="flex-1">
                <marble :visible='true' :cant='safe'></marble>
            </div>
            <div class="flex-1">
                <marble :visible='true' :cant='marbleSafe'></marble>
            </div>
            <div class="flex-1">
                <marble :visible='true' :cant='marble'></marble>
            </div>
            <div class="flex-1">
                <marble :visible='true' :cant='max_capacity'></marble>
            </div>
        </div>
        <div class="d-flex p-1">
            <div class="flex-1">
                <glass :visible='true' :cant='safe'></glass>
            </div>
            <div class="flex-1">
                <glass :visible='true' :cant='glassSafe'></glass>
            </div>
            <div class="flex-1">
                <glass :visible='true' :cant='glass'></glass>
            </div>
            <div class="flex-1">
                <glass :visible='true' :cant='max_capacity'></glass>
            </div>
        </div>
        <div class="d-flex p-1">
            <div class="flex-1">
                <sulfur :visible='true' :cant='safe'></sulfur>
            </div>
            <div class="flex-1">
                <sulfur :visible='true' :cant='sulfurSafe'></sulfur>
            </div>
            <div class="flex-1">
                <sulfur :visible='true' :cant='sulfur'></sulfur>
            </div>
            <div class="flex-1">
                <sulfur :visible='true' :cant='max_capacity'></sulfur>
            </div>
        </div>
    </div>
</template>

<script>
import $resources from 'Stores/resources'
import $config from 'Stores/config'
import wood from 'Components/other/resources/wood.vue'
import wine from 'Components/other/resources/wine.vue'
import marble from 'Components/other/resources/marble.vue'
import glass from 'Components/other/resources/glass.vue'
import sulfur from 'Components/other/resources/sulfur.vue'

export default {
    name: 'Deposito',
    props:['data'],
    components:{
        wood,
        wine,
        marble,
        glass,
        sulfur
    },
    data(){
        return {
            level:0,
            max_capacity:0,
            safe:0
        }
    },
    methods:{
        init(){
            this.level = this.data.maximum ? this.data.level : this.data.level-1;
            this.max_capacity = this.warehouse.capacity_base + (this.level * this.warehouse.capacity);
            this.safe = this.warehouse.resource_protected_base + (this.level * this.warehouse.resource_protected);
        }
    },
    computed:{
        wood(){
            return $resources.state.wood;
        },
        wine(){
            return $resources.state.wine;
        },
        marble(){
            return $resources.state.marble;
        },
        glass(){
            return $resources.state.glass;
        },
        sulfur(){
            return $resources.state.sulfur;
        },
        woodSafe(){
            return this.wood>this.safe ? this.wood-this.safe : 0;
        },
        wineSafe(){
            return this.wine>this.safe ? this.wine-this.safe : 0;
        },
        marbleSafe(){
            return this.marble>this.safe ? this.marble-this.safe : 0;
        },
        glassSafe(){
            return this.glass>this.safe ? this.glass-this.safe : 0;
        },
        sulfurSafe(){
            return this.sulfur>this.safe ? this.sulfur-this.safe : 0;
        },
        warehouse(){
            return $config.state.world.warehouse;
        }
    },
    watch:{
        data(newval,oldval){
            if(newval.level!=oldval.level){
                this.init()
            }
        }
    },
    beforeMount(){
        this.init()
    }
}
</script>

<style lang="scss" scoped>
    .box{
        padding-top: 0px!important;
        font-size: 0.83rem;
    }
    .fondo{
        background: #dec493;
    }
</style>
