<template>
    <div class="mBorder">
        <Ventana1 :close='close' titulo="Mayor">
        <div class="box">
            <div class="gtitle text-center mb-2">Eventos actuales ({{data.total}})</div>
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
                    <tr v-for='(item,index) in data.items' :key='index' :class="getActive(item)">
                        <td><img :src="require('Img/icon/'+getIcon(item.type))"></td>
                        <td class="go" title="Ir a la ciudad" @click='goTo(item)'><b>{{item.city_name}}</b></td>
                        <td>{{item.fecha}}</td>
                        <td>
                            <div v-if="item.type==1">
                                <div v-if="item.data.level==1" v-html="$t('mayor['+[item.type]+'].created',[$t('buildings['+item.data.building_id+'].name')])"></div>
                                <div v-else v-html="$t('mayor['+[item.type]+'].upgrade',[$t('buildings['+item.data.building_id+'].name'),item.data.level])"></div>
                            </div>
                            <div v-else-if="item.type==2">
                                <div class="mb-2">Tu flota mercante de <b>{{item.city_name}}</b> ha llegado a <b>{{item.data.city_name}}</b> y ha traído los siguientes bienes:</div>
                                <div>
                                    <wood :cant='item.data.resources.wood'></wood>
                                    <wine :cant='item.data.resources.wine'></wine>
                                    <marble :cant='item.data.resources.marble'></marble>
                                    <glass :cant='item.data.resources.glass'></glass>
                                    <sulfur :cant='item.data.resources.sulfur'></sulfur>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-center">
                <div class="d-inline-block go" title="Ultimos 10" @click='nextPage(false)' v-if='data.page>1'>
                    <img :src="require('Img/icon/btn_min.png')">
                </div>
                <div class="d-inline-block">{{(((data.page-1)*10)+1)}} - {{(((data.page-1)*10)+data.items.length)}}</div>
                <div class="d-inline-block go" title="Próximos 10" @click='nextPage(true)' v-if='data.more'>
                    <img :src="require('Img/icon/btn_max.png')">
                </div>
            </div>
        </div>
        </Ventana1>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import $modal from 'Stores/modal'
import $city from 'Stores/city'
import axios from "axios";
import $notification from 'Stores/notification'
import wood from 'Components/other/resources/wood.vue'
import wine from 'Components/other/resources/wine.vue'
import marble from 'Components/other/resources/marble.vue'
import glass from 'Components/other/resources/glass.vue'
import sulfur from 'Components/other/resources/sulfur.vue'

export default {
    name:'Mayor',
    props:['info','close'],
    components:{
        Ventana1,
        wood,
        wine,
        marble,
        glass,
        sulfur
    },
    data(){
        return {
            data:{}
        }
    },
    methods:{
        getActive(item){
            return item.readed==0 ? 'active' : '';
        },
        nextPage(type){
            var page = type ? this.data.page+1 : this.data.page-1
            axios("user/getMayor?page="+page).then(res => {
                this.data = res.data
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        },
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
                case 2:
                    return 'icon_transport.png';
                break;
            }
        }
    },
    beforeMount(){
        this.data = this.info
    }
}
</script>

<style lang="scss" scoped>
@import "~Sass/modal";
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    .go:hover{
        text-decoration: underline
    }
    .go{
        cursor: pointer;
        user-select: none;
    }
    .table td, .table th {
        padding: 5px;
    }
    .active {
        background: #f2ddbc;
    }
</style>
