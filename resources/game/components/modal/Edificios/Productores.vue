<template>
    <div class="box">
        <div>
            <div class="gtitle text-center mb-3">{{$t('buildingProducer.title',{building:building_name})}}</div>
            <div class="d-flex my-2">
                <div class="flex-2 d-flex align-items-center">
                    <div>{{$t('buildingProducer.productionBase')}}:</div>
                </div>
                <div class="flex-1 d-flex align-items-center">
                    <div>{{$money_two(workers)}}</div>
                </div>
                <div class="flex-4">
                    <div class="bar_cell" :style="{width:(100-(workers*per))+'%'}">
                        <div class="bar_green">
                            <div class="bar_brown"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex my-2">
                <div class="flex-2 d-flex align-items-center">
                    <div>{{building_name}}:</div>
                </div>
                <div class="flex-1 d-flex align-items-center">
                    <div>{{$money_two(workers*per)}}</div>
                </div>
                <div class="flex-4">
                    <div class="bar_cell" :style="{width:(workers*per)+'%'}">
                        <div class="bar_green">
                            <div class="bar_brown"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex my-2">
                <div class="flex-2 d-flex align-items-center">
                    <div>Total:</div>
                </div>
                <div class="flex-1 d-flex align-items-center">
                    <div>{{$money_two(workers+(workers*per))}}</div>
                </div>
                <div class="flex-4">
                    <div class="bar_cell">
                        <div class="bar_green">
                            <div class="bar_brown"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $resources from 'Stores/resources'

export default {
    name: 'Productores',
    props:['data'],
    data(){
        return {
            type:0,
            level:0,
            workers:0,
            per:0,
            building_name:'',
            dataBuilding:[]
        }
    },
    methods:{
        init(){
            this.level = this.data.level - 1;
            this.building_id = this.data.building_id;
            this.per = ((this.level*2)/100);
            this.building_name = this.$t('buildings['+this.building_id+'].name');
            //Seteamos el tipo de productor
            if(this.data.building_id==11){
                this.type = 1;
                this.workers = this.worker_forest;
            }else{
                this.type = 0;
                this.workers = this.worker_mine;
            }
        }
    },
    computed:{
        worker_forest(){
            return $resources.state.population.worker_forest;
        },
        worker_mine(){
            return $resources.state.population.worker_mine;
        }
    },
    watch:{
        data(newval,oldval){
            if(newval.building_id!=oldval.building_id){
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
        font-size: 0.83rem;
    }
    .bar_cell{
        border: 1px solid #c99868;
    }
    .bar_green {
        background-image: url('~Img/icon/lightgreen.png');
        height: 20px;
    }
</style>