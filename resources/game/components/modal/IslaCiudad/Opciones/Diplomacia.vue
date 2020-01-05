<template>
    <div class="box">
        <div>{{$t('diplomacy.text')}}</div>
        <div class="mt-3">
            <div class="my-2"><b>{{$t('diplomacy.receiver')}}:</b> {{data.city.user}}</div>
            <div class="my-2"><b>{{$t('diplomacy.subject')}}:</b> {{$t('diplomacy.message')}}</div>
            <div class="mt-2"><b>{{$t('diplomacy.message')}}:</b></div>
            <div>
                <textarea v-model='message' class="w-100" rows='10'></textarea>
                <div v-if="error" class="text-danger">{{$t('diplomacy.errorMessage')}}</div>
                <div>{{messageLength}} {{$t('diplomacy.characters')}}</div>
            </div>
            <div class="text-center mt-2">
                <div class="btnGeneral" title="Enviar" @click='enviar'>{{$t('diplomacy.send')}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import $city from 'Stores/city'

export default {
    name: 'Diplomacia',
    props:['data','changeType'],
    data(){
        return {
            message:'',
            error:false,
            maxLength:1500
        }
    },
    methods:{
        enviar(){
            if(this.message.trim()==''){
                this.error = true
                return
            }
            axios.post('user/sendMessage/'+this.data.city.city_id,{
                city_from:this.city_id,
                message:this.message
            })
            .then(res =>{
                if(res.data!='ok'){
                    $notification.commit('show',{advisor:4,type:false,message:res.data});
                }else{
                    this.message = ''
                    this.changeType(0)
                    $notification.commit('show',{advisor:4,type:true});
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:4,type:false,message:err});
            })
        }
    },
    computed:{
        messageLength(){
            return this.maxLength - this.message.length;
        },
        city_id(){
            return $city.state.city_id;
        }
    },
    watch:{
        message(newval){
            if(newval.length>this.maxLength){
                 this.message = this.message.substr(0, this.maxLength);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    textarea{
        resize: none
    }
    .btnGeneral{
        display: inline-block;
        padding: 10px 25px;
    }
</style>
