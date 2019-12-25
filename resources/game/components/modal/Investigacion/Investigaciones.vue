<template>
    <div class="box">
        <div class="gtitle text-center">Area: {{$t('researchCategories['+category+']')}}</div>
        <div class="d-flex my-3 py-1 px-3 fondo">
            <div class="flex-1 d-flex">
                <div class="mr-2"><img :src="require('Img/icon/icon_scientist.png')"></div>
                <div>Investigadores: {{total_scientists}}</div>
            </div>
            <div class="flex-1 d-flex justify-content-center">
                <div class="mr-2"><img :src="require('Img/icon/icon_pi.png')"></div>
                <div>Puntos de investigación: {{research_point}}</div>
            </div>
            <div class="flex-1 d-flex justify-content-end">
                <div class="mr-2"><img :src="require('Img/icon/icon_research_time.png')"></div>
                <div>Por hora: {{research_point_hour}}</div>
            </div>
        </div>
        <div class="d-flex">
            <div class="flex-1 mr-2 lista">
                <div v-for='(research,index) in researchs' :key='index' @click='changeResearch(research,index)' class="d-flex py-1 px-2 research" :class="getClass(research)">
                    <div class="mr-2">{{research.level}}.</div>
                    <div class="research-name">{{$t('research['+research.id+'].name')}}</div>
                </div>
            </div>
            <div class="flex-2 p-2 borde">
                <div class="gtitle mb-2">{{$t('research['+selected.id+'].name')}}</div>
                <div class="text text-justify">{{$t('research['+selected.id+'].text')}}</div>
                <div class="text-right mt-3">
                    <div v-if='selected.level>maxLevel+1' class="text-danger">Aun no has investigado el nivel anterior</div>
                    <div v-else>
                        <div class="btnGeneral" v-if="research_point>=selected.cost" @click='investigar'>Investigar</div>
                        <div class="text-danger" v-else>No tienes suficientes puntos de investigacion</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $resources from 'Stores/resources'

export default {
    name: 'Investigaciones',
    props:['data','category'],
    data(){
        return {
            researchs:[],
            selected:{},
            maxLevel:0
        }
    },
    methods:{
        changeResearch(research,index){
            this.selected = {
                id:research.id,
                level:research.level,
                cost:research.cost,
                index:index
            };
        },
        getClass(research){
            var clase = '';
            clase += research.id==this.selected.id ? 'active ' : '';
            clase += research.level>this.maxLevel+1 ? 'inactive ' : '';
            return clase;
        },
        investigar(){
            
        },
        initData(){
            this.researchs = this.data.research.filter(x =>{
                return x.category_id == this.category;
            });
            var userResearch = this.researchs.filter(x =>{
                return this.data.user_research.includes(x.id);
            });
            if(userResearch.length>0){
                this.maxLevel = Math.max.apply(Math, userResearch.map(function(o) { return o.level; }))
            }else{
                this.maxLevel = 0
            }
            this.researchs.some((research,index) =>{
                if(research.level == this.maxLevel+1){
                    this.changeResearch(research,index)
                    return
                }
            });
        }
    },
    computed:{
        total_scientists(){
            return $resources.state.userResources.total_scientists;
        },
        research_point(){
            return this.$money($resources.state.userResources.research_point);
        },
        research_point_hour(){
            return this.$money_two(this.total_scientists);
        }
    },
    watch:{
        category(newval){
            this.initData()
        }
    },
    beforeMount(){
        this.initData()
    }
}
</script>

<style lang="scss" scoped>
 .box{
    font-size: 0.83rem;
 }
 .active,.fondo{
    background: #dec493;
 }
 .research{
     cursor: pointer;
 }
 .research:hover{
    background: #dec493;
    text-decoration: underline;
 }
 .text{
    line-height: 0.83rem;
 }
 .borde{
    border: 1px solid #e3c998;
 }
 .gtitle{
    font-size: 0.90rem;
 }
 .inactive{
    color: gray
 }
 .btnGeneral{
    display: inline-block;
    padding: 4px 25px;
 }
 .lista{
    overflow: hidden;
    user-select: none;
 }
 .research-name{
    white-space: nowrap;
 }
</style>