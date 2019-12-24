<template>
    <div class="py-3 box">
        <div class="position-relative">
            <img :src="getImage()">
            <div class="box-level">
                <div class="box-level2">
                    <div>Nivel:</div>
                    <div class="level">{{data.level}}</div>
                </div>
            </div>
        </div>
        <div>
            <div class="gtitle my-2">Necesario para el próximo nivel:</div>
            <div class="text-left pl-5 d-flex align-items-center">
                <div><img :src="require('Img/icon/icon_wood.png')"></div>
                <div class="ml-2">{{$money(data.required_wood)}}</div>
            </div>
            <div class="gtitle my-2">Existente:</div>
            <div class="text-left pl-5 d-flex align-items-center">
                <div><img :src="require('Img/icon/icon_wood.png')"></div>
                <div class="ml-2">{{$money(data.donated)}}</div>
            </div>
        </div>
        <div v-if="data.constructed_at==null">
            <div class="gtitle mt-3">Donar</div>
            <div class="mt-2">
                <input class="w-50" type="number" v-model="value">
            </div>
            <div class="mb-3 max" @click='setMax'>max</div>
            <div class="btnGeneral w-75 py-1 m-auto">
                <div @click='confirmar'>Confirmar</div>
            </div>
        </div>
        <div v-else class="mt-3">
            <div>En ampliacion</div>
            <div>{{timeConstruct}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from "moment";
import $resources from 'Stores/resources'
import $store from 'Stores/store'
import {catchAxios} from 'Js/util.js'

export default {
    name:'IslandDonation',
    props:['data','reloadDonation'],
    data(){
        return {
            value:0,
            max:0
        }
    },
    methods:{
        setMax(){
            this.value = this.max;
        },
        confirmar(){
            if(this.value!=0){
                axios.put('island/donation/'+this.$route.params.island,{
                    type:this.data.type,
                    wood:this.value,
                    city:this.city_id
                })
                .then(res =>{
                    Swal.fire('Exito','Donacion exitosa','success')
                    $resources.commit('donate',{wood:this.value})
                    this.setDonation()
                })
                .catch(err =>{
                    catchAxios(err)
                })
            }
        },
        setDonation(){
            this.data.donated += parseInt(this.value);
            this.max = this.max - this.value;
            this.value = 0;
            //Si hay que ampliar lo mostramos
            if(this.max==0){
                this.data.constructed_at = moment(this.now).add(this.data.required_time, 'seconds');
            }
        },
        initMax(){
            var max = this.data.required_wood - this.data.donated;
            this.max = this.wood>max ? max : this.wood;
        },
        getImage(){
             if(this.data.type==1){
                return require('Img/island/img_wood.jpg');
            }else{
                switch(this.data.island_type){
                    case 1:
                        return require('Img/island/img_wine.jpg');
                    break;
                    case 2:
                        return require('Img/island/img_marble.jpg');
                    break;
                    case 3:
                        return require('Img/island/img_glass.jpg');
                    break;
                    case 4:
                        return require('Img/island/img_sulfur.jpg');
                    break;
                }
            }
        }
    },
    computed:{
        wood(){
            return this.$floor($resources.state.wood);
        },
        city_id(){
            return $store.state.city_id;
        },
        timeConstruct() {
            if (this.data.constructed_at != null) {
                return this.$sectotime(moment
                .duration(moment(this.data.constructed_at).diff(moment($store.state.now)))
                .asSeconds());
            }else {
                return null;
            }
        },
        now(){
            return $store.state.now;
        }
    },
    watch:{
         value(newval){
            var control = true;
            if(newval>this.max){
                this.value = this.max; 
                control = false;
            }
            if(newval<0||newval==''){
                this.value = 0; 
                control = false;
            }
            if(control)
            this.value = newval.toString().replace(/^0+/, '');
        },
        timeConstruct(newval){
            if (newval == "00s") {
                this.constructed_at = null;
                this.reloadDonation();
            }
        },
        data(newval,oldval){
            if(newval.level!=oldval.level){
                this.initMax();
            }
        }
    },
    mounted(){
        this.initMax();
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        text-align: center;
    }
    .box-level{
        position: absolute;
        bottom: 0;
        right: 20px;
        top: 0;
        display: flex;
    }
    .box-level2{
        background: #dfb26f;
        margin: auto;
        padding: 3px 10px 7px;
        line-height: 1.2rem;
    }
    .level{
        font-size: 1.3rem;
    }
    .max{
        cursor: pointer;
        user-select: none;
    }
</style>