<template>
    <div class="box">
        <div>
            <div class="gtitle text-center mb-3">{{$t('buildingReducer.building',{building_id:building_name})}}</div>
            <div class="d-flex my-2" v-for='i in 3' :key='i'>
                <div class="flex-2 d-flex align-items-center">
                    <div>{{dataBuilding[i-1].name}}</div>
                </div>
                <div class="flex-1 d-flex align-items-center">
                    <div>{{$money_two(100-dataBuilding[i-1].per)}}%</div>
                </div>
                <div class="flex-3">
                    <div class="bar_cell" title='costos' :style="{width:dataBuilding[i-1].per2+'%'}">
                        <div class="bar_green">
                            <div class="bar_brown"  :style="{width:100-(dataBuilding[i-1].per-(100-dataBuilding[i-1].per2))+'%'}"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gtitle text-center mb-3 mt-4">{{$t('buildingReducer.unit',{building_id:building_name})}}</div>
            <div class="d-flex my-2">
                <div class="flex-2 d-flex align-items-center">
                    <div>{{$t('buildingReducer.costBase')}}:</div>
                </div>
                <div class="flex-1 d-flex align-items-center">
                    <div>100.00%</div>
                </div>
                <div class="flex-3">
                    <div class="bar_cell" title='costos'>
                        <div class="bar_green">
                            <div class="bar_brown"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex my-2">
                <div class="flex-2 d-flex align-items-center">
                    <div>- {{building_name}} ({{$money_two(this.level)}}%)</div>
                </div>
                <div class="flex-1 d-flex align-items-center">
                    <div>{{$money_two(100-this.level)}}%</div>
                </div>
                <div class="flex-3">
                    <div class="bar_cell" title='costos'>
                        <div class="bar_green">
                            <div class="bar_brown" :style="{width:(100-this.level)+'%'}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $config from 'Stores/config'

export default {
    name: 'Reductores',
    props:['data'],
    data(){
        return {
            type:0,
            level:0,
            buildingName:'',
            dataBuilding:[]
        }
    },
    methods:{
        setDataBuilding(){
            this.dataBuilding.push({name:this.$t('buildingReducer.costBase')+':',per:0,per2:100})
            var research = this.sumResearch()
            this.dataBuilding.push({name:'- '+this.$t('buildingReducer.research')+' ('+this.$money_two(research)+'%):',per:research,per2:100})
            var level = this.level+research;
            this.dataBuilding.push({name:'- '+this.building_name+' ('+this.$money_two(this.level)+'%):',per:level,per2:(100-research)})
        },
        sumResearch(){
            var research = 0;
            research += this.user_research.includes(3) ? 2 : 0;
            research += this.user_research.includes(7) ? 4 : 0;
            research += this.user_research.includes(10) ? 8 : 0;
            return research;
        },
        init(){
            this.dataBuilding = []
            this.level = this.data.level - 1;
            this.building_id = this.data.building_id;
            this.building_name = this.$t('buildings['+this.building_id+'].name');
            this.setDataBuilding();
            //Seteamos el tipo de reductor
            switch(this.data.building_id){
                case 6:
                    this.type = 0;
                break;
                case 7:
                    this.type = 3;
                break;
                case 8:
                    this.type = 4;
                break;
                case 9:
                    this.type = 1;
                break;
                case 10:
                    this.type = 2;
                break;
            }
        }
    },
    computed:{
        user_research(){
            return $config.state.user_research;
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
    .bar_brown{
        background-image: url('~Img/icon/lightbrown.png');
        height: 20px;
    }
    .bar_green {
        background-image: url('~Img/icon/lightgreen.png');
        height: 20px;
    }
</style>
