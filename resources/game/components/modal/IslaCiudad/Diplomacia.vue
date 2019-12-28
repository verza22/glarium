<template>
    <div class="box">
        <div>Aquí puedes escribir mensajes a otros jugadores u ofrecerles acuerdos en tanto hayas ya investigado los distintos tipos de acuerdos existentes.</div>
        <div class="mt-3">
            <div class="my-2"><b>Destinatario:</b> {{data.city.user}}</div>
            <div class="my-2"><b>Asunto:</b> Mensaje</div>
            <div class="mt-2"><b>Mensaje:</b></div>
            <div>
                <textarea v-model='message' class="w-100" rows='10'></textarea>
                <div v-if="error" class="text-danger">Debes ingresar el mensaje</div>
                <div>{{messageLength}} caracteres disponibles.</div>
            </div>
            <div class="text-center mt-2">
                <div class="btnGeneral" title="Enviar" @click='enviar'>Enviar</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'

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
            axios.post('user/sendMessage/'+this.data.city.user_id,{
                message:this.message
            })
            .then(res =>{
                if(res.data!='ok'){
                    callError(res)
                }else{
                    this.message = ''
                    this.changeType(0)
                }
            })
            .catch(err =>{
                catchAxios(err)
            })
        }
    },
    computed:{
        messageLength(){
            return this.maxLength - this.message.length;
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
