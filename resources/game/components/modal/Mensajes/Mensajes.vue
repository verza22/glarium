<template>
    <div class="mBorder">
        <Ventana1 :close='close' titulo="Consejero diplomático">
        <div class="box">
            <div class="d-flex">
                <div class="selectContainer" :class="type==0 ? 'active' : ''" title="Mensajes Recibidos" @click='change(0)'>
                    <div class="imagen"></div>
                    <div class="texto">Entrada ({{this.info.received.length}})</div>
                </div>
                <div class="selectContainer" :class="type==1 ? 'active' : ''" title="Mensajes Enviados" @click='change(1)'>
                    <div class="imagen"></div>
                    <div class="texto">Salida ({{this.info.sended.length}})</div>
                </div>
            </div>
            <ListaMensaje :remove='remove' :type='type' :data='messages' v-if="messages.length>0"></ListaMensaje>
            <div v-else class="nomessage">No hay mensajes</div>
        </div>
        </Ventana1>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import ListaMensaje from 'Components/modal/Mensajes/ListaMensaje.vue'

export default {
    name:'Mensajes',
    props:['info','close'],
    components:{
        Ventana1,
        ListaMensaje
    },
    data(){
        return {
            type:0,
            data:{}
        }
    },
    methods:{
        change(type){
            this.type = type
        },
        remove(list){
            var messages = this.type==0 ? this.data.received : this.data.sended;
            messages = messages.filter(element => {
                return !list.includes(element.id);
            });
            if(this.type==0){
                this.data.received = messages;
            }else{
                this.data.sended = messages;
            }
        }
    },
    computed:{
        messages(){
            return this.type==0 ? this.data.received : this.data.sended;
        }
    },
    beforeMount(){
        this.data = this.info;
    }
}
</script>

<style lang="scss" scoped>
@import "~Sass/modal";
    .box{
        font-size: 0.83rem;
        line-height: 0.83rem;
    }
    .imagen{
        background-image: url('~Img/icon/schriftrolle_closed.png');
        width: 17px;
        height: 17px;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-block;
        margin-top: auto;
        margin-bottom: auto;
    }
    .active .imagen{
        background-image: url('~Img/icon/schriftrolle_offen.png');
    }
    .active{
        background: #dfc594;
    }
    .texto{
        display: inline-block;
        margin-top: auto;
        margin-bottom: auto;
        margin-left: 5px;
    }
    .selectContainer{
        display: flex;
        justify-content: center;
        flex: 1;
        padding: 5px 0px;
        cursor: pointer;
    }
    .nomessage{
        text-align: center;
        margin: 20px 0px 10px;
    }
</style>
