<template>
    <div class="mBorder">
        <Ventana1 :close='close' titulo="Mayor">
        <div class="box">
            <table class="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Lugar</th>
                        <th>Fecha</th>
                        <th>Asunto</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='(item,index) in info' :key='index'>
                        <td><img :src="require('Img/icon/'+getIcon(item.type))"></td>
                        <td class="go" title="Ir a la ciudad" @click='goTo(item)'>{{item.city_name}}</td>
                        <td>{{item.fecha}}</td>
                        <td v-html="getMessage(item)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        </Ventana1>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import $modal from 'Stores/modal'
import $city from 'Stores/city'

export default {
    name:'Mayor',
    props:['info','close'],
    components:{
        Ventana1,
    },
    methods:{
        goTo(item){
            $modal.commit('changeRoute')
            if(this.$route.name=='City'){
                if(this.$route.params.city==item.city_id){
                    return;
                }
            }
            $city.commit('setCityId',{city_id:item.city_id})
            this.$router.push({ name: 'City', params: { city:item.city_id}})
        },
        getIcon(type){
            switch(type){
                case 1:
                    return 'icon_production.png';
                break;
            }
        },
        getMessage(item){
            var data = JSON.parse(item.data)
            switch(item.type){
                case 1:
                    if(data.level==1){
                        return this.$t('mayor['+[item.type]+'].created',[this.$t('buildings['+data.building_id+'].name')])
                    }else{
                        return this.$t('mayor['+[item.type]+'].upgrade',[this.$t('buildings['+data.building_id+'].name'),data.level])
                    }
                break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~Sass/modal";
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    tbody td{
        vertical-align: middle;
    }
    .go:hover{
        text-decoration: underline
    }
    .go{
        cursor: pointer;
        user-select: none;
    }
</style>
