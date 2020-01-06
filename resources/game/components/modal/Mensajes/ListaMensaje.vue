<template>
    <div class="mt-3">
        <table class="table" id="tableMessage">
            <thead>
                <tr>
                    <th style="width:37px"></th>
                    <th style="width:70px">{{$t('actions.titleS')}}</th>
                    <th>{{$t('diplomacy.receiver')}}</th>
                    <th>{{$t('diplomacy.subject')}}</th>
                    <th>{{$t('diplomacy.city')}}</th>
                    <th style="width:150px">{{$t('other.date')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(msg,index) in data' :key='index' @click='open(msg,$event)' :id="'identifier_'+msg.id" :class='noRead(msg)'>
                    <td><input type="checkbox" :msg_index='index' :msg_id='msg.id' name="check"></td>
                    <td class="text-center"><div class="btn-action"></div></td>
                    <td>{{msg.user.name}}</td>
                    <td>{{$t('diplomacy.message')}}</td>
                    <td class="go" title="Ir a la ciudad" @click='goTo(msg)'>{{msg.city.name}} [{{msg.city.x}}:{{msg.city.y}}]</td>
                    <td>{{msg.date}}</td>
                </tr>
            </tbody>
        </table>
        <div id="response" class="hidden mt-2">
            <div class="btnGeneral" @click='responder($event)'>Responder</div>
            <div class="btnGeneral" @click='borrar'>{{$t('other.remove')}}</div>
        </div>
        <div>
            <div class="mb-2">
                <div class="d-inline-block next" title="Ultimos 10 mensajes" @click='nextPage(false)' v-if='page>1'>
                    ...últimos 10 <img :src="require('Img/icon/btn_min.png')">
                </div>
                <div class="d-inline-block">{{(((page-1)*10)+1)}} - {{(((page-1)*10)+data.length)}}</div>
                <div class="d-inline-block next" title="Próximos 10 mensajes" @click='nextPage(true)' v-if='more'>
                    <img :src="require('Img/icon/btn_max.png')"> próximos 10...
                </div>
            </div>
            <div class="mb-2">
                <div class="btn-picker" @click='checked(true)'>{{$t('messages.all')}}</div>
                <div class="d-inline-block" v-if='type==0'>
                    <div class="d-inline-block"> | </div>
                    <div class="btn-picker" @click='checkedReaded(0)'>No leidos</div>
                    <div class="d-inline-block"> | </div>
                    <div class="btn-picker" @click='checkedReaded(1)'>Leidos</div>
                </div>
                <div class="d-inline-block"> | </div>
                <div class="btn-picker" @click='checked(false)'>{{$t('messages.none')}}</div>
            </div>
            <div class="btnGeneral" @click='readed' v-if='type==0'>Marcar como leido</div>
            <div class="btnGeneral" @click='borrar'>{{$t('other.remove')}}</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import $notification from 'Stores/notification'
import $modal from 'Stores/modal'
import $city from 'Stores/city'

export default {
    name:'ListaMensajes',
    props:['data','type','remove','read','page','more','nextPage'],
    methods:{
        goTo(msg){
            axios('island/'+msg.city.island_id)
            .then(res =>{
                $modal.commit('changeRoute')
                res.data.focusCity = msg.city.id
                $city.dispatch('setIsland',{island:res.data})
            })
            .catch(err => {
                $notification.commit('show',{advisor:1,type:false,message:err});
            });
        },
        noRead(msg){
            return msg.readed==0 ? 'noRead' : ''
        },
        responseButtons(msg,newCell){
            //Responder mensajes
            if(this.type==0){
                //boton de responder
                var response = document.getElementById('response').cloneNode(true);
                response.classList.remove('hidden')
                response.children[0].addEventListener('click', function() {
                    var info = {
                        type:3,
                        city:{
                            user:msg.user.name,
                            city_id:msg.city.id
                        }
                    }
                    $modal.commit('openModal',{
                        type:4,
                        info:info
                    })
                })
                //boton de borrar
                var self = this;
                response.children[1].addEventListener('click', function() {
                    self.borrarMsg([msg.id])
                })
                newCell.appendChild(response);
            }
        },
        open(msg,event){
            //Si es mensajes recibidos actualizamos su estado a leido
            if(this.type==0){
                axios.put('user/readMessage/'+msg.id)
                msg.readed=1
                this.read(1)
            }
            if(event.toElement.type=='checkbox'){
                return
            }
            var rowRef = document.getElementById('identifier_'+msg.id);
            var rowRef_msg = document.getElementById('sub_identifier_'+msg.id);
            if(rowRef_msg==null){
                var tableRef = document.getElementById('tableMessage').getElementsByTagName('tbody')[0];
                var newRow   = tableRef.insertRow(rowRef.rowIndex);
                newRow.id = 'sub_identifier_'+msg.id;
                newRow.setAttribute("name", "sub_identifier");
                var newCell  = newRow.insertCell(0);
                newCell.setAttribute("colspan", "6");
                var newText  = document.createTextNode(msg.message);
                newCell.appendChild(newText);
                rowRef.classList.add("active");
                this.responseButtons(msg,newCell)
            }else{
                rowRef_msg.remove()
                rowRef.classList.remove("active");
            }
        },
        checked(type){
            document.getElementsByName('check').forEach(x =>{
                x.checked = type;
            });
        },
        checkedReaded(type){
            document.getElementsByName('check').forEach(x =>{
                if(this.data[x.getAttribute('msg_index')].readed==type){
                    x.checked = true;
                }else{
                    x.checked = false;
                }
            });
        },
        readed(){
            var msg = [];
            document.getElementsByName('check').forEach(x =>{
                if(x.checked){
                    msg.push(parseInt(x.getAttribute('msg_id')));
                }
            });
            if(msg.length>0){
                axios.put('user/readMessages',{
                    messages:msg
                })
                .then(res =>{
                    if(res.data=='ok'){
                        this.read(msg.length)
                        document.getElementsByName('check').forEach(x =>{
                            if(x.checked){
                                //Ponemos como leidos todos los mensajes
                                x.parentElement.parentElement.classList.remove('noRead')
                                x.checked = false
                            }
                        });
                        $notification.commit('show',{advisor:4,type:true});
                    }else{
                        $notification.commit('show',{advisor:4,type:false,message:res.data});
                    }
                })
                .catch(err =>{
                    $notification.commit('show',{advisor:4,type:false,message:err});
                })
            }
        },
        borrar(){
            var msg = [];
            document.getElementsByName('check').forEach(x =>{
                if(x.checked){
                    msg.push(parseInt(x.getAttribute('msg_id')));
                }
            });
            if(msg.length>0){
                this.borrarMsg(msg)
            }
        },
        borrarMsg(msg){
            axios.post('user/message',{
                messages:msg,
                type:this.type
            })
            .then(res =>{
                if(res.data=='ok'){
                    document.getElementsByName('check').forEach(x =>{
                        if(x.checked){
                            var sub = document.getElementById('sub_identifier_'+x.getAttribute('msg_id'));
                            if(sub!=null)
                            sub.remove()
                        }
                    });
                    this.remove(msg)
                    this.checked(false)
                    $notification.commit('show',{advisor:4,type:true});
                }else{
                    $notification.commit('show',{advisor:4,type:false,message:res.data});
                }
            })
            .catch(err =>{
                $notification.commit('show',{advisor:4,type:false,message:err});
            })
        }
    },
    watch:{
        data(newval){
            var rows = document.getElementsByName('sub_identifier');
            for(var i=rows.length-1;i>=0;i--){
                rows[i].remove();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    tbody tr{
        cursor: pointer
    }
    tbody tr:hover .btn-action{
        background-position-y: 15px;
    }
    .btn-action{
        background-image: url('~Img/icon/msg.png');
        width: 15px;
        height: 15px;
        display: inline-block;
        background-position-x: 15px;
    }
    .active .btn-action{
        background-position-x: 0px;
    }
    .btnGeneral{
        display: inline-block;
        padding: 10px 20px;
    }
    .btn-picker,.next{
        cursor: pointer;
        display: inline-block;
        user-select: none;
    }
    .btn-picker:hover,.next:hover{
        text-decoration: underline;
    }
    tr.noRead{
        font-weight: bold;
    }
    td,th{
        vertical-align: middle;
    }
    tr{
        font-size: 0.75rem;
        line-height: 0.75rem;
    }
    .go:hover{
        text-decoration: underline
    }
    .go{
        cursor: pointer;
        user-select: none;
    }
</style>
