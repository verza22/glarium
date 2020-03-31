<template>
    <div class="ccontainer">
        <div class="ctitle">
            <div class="ctitle2">Chat</div>
        </div>
        <div class="cbody p-2" v-chat-scroll>
            <div v-for="(item,index) in messages" :key="index" class="d-flex">
                <div class="mr-2">
                    <div>{{item.name}}:</div>
                    <div class="ctime">{{item.time}}</div>
                </div>
                <div>{{item.message}}</div>
            </div>
        </div>
        <div>
            <form class="d-flex w-100" @submit="sendMessage">
                <input maxlength="50" v-model="message" class="inputSend" type="text" placeholder="Escribir mensaje...">
                <button>Enviar</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'Chat',
    data() {
        return {
            messages:[{name:'admin',message:'Bienvenido a Glarium!',time:'00:00'}],
            message:''
        }
    },
    methods:{
        sendMessage(event){
            event.preventDefault();
            axios.post('chat/send',{
                message:this.message
            })
            this.message = ''
        },
        addMessage(data){
            this.messages.push({name:data.name,message:data.message,time:data.time})
        }
    },
    mounted(){
        this.$chChat.bind('sendMessage', (data) => {
            this.addMessage(data.data);
        });
    }
}
</script>

<style lang="scss" scoped>
    .ccontainer{
        position: fixed;
        width: 300px;
        height: 275px;
        bottom: 0;
        left: 0;
        z-index: 5;
        margin: 10px;
        display: flex;
        flex-direction: column;
        font-size: 13px;
    }
    .ctitle2{
        background: #cfc19c;
        display: inline-block;
        padding: 0px 6px;
        font-size: 12px;
        margin-top: 4px;
    }
    .ctitle{
        background: url('~Img/icon/modal_header.jpg');
        text-align: center;
    }
    .cbody{
        flex:1;
        overflow: auto;
        background: url('~Img/icon/fondo.jpg');
    }
    .inputSend{
        flex: 1;
    }
    .ctime{
        font-size: 9px;
    }
</style>
