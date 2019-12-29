<template>
    <div class="mt-3">
        <table class="table" id="tableMessage">
            <thead>
                <tr>
                    <th style="width:37px"></th>
                    <th style="width:70px">Accion</th>
                    <th>Destinatario</th>
                    <th>Asunto</th>
                    <th>Ciudad</th>
                    <th style="width:150px">Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(msg,index) in data' :key='index' @click='open(msg,$event)' :id="'identifier_'+msg.id">
                    <td><input type="checkbox" :msg_id='msg.id' name="check"></td>
                    <td class="text-center"><div class="btn-action"></div></td>
                    <td>{{msg.user.name}}</td>
                    <td>Mensaje</td>
                    <td>Polis</td>
                    <td>{{msg.date}}</td>
                </tr>
            </tbody>
        </table>
        <div>
            <div class="mb-2">
                <div class="btn-picker" @click='checked(true)'>Todos</div>
                <div class="d-inline-block"> | </div>
                <div class="btn-picker" @click='checked(false)'>Ninguno</div>
            </div>
            <div class="btnGeneral" @click='borrar'>Borrar</div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {catchAxios,callError} from 'Js/util.js'

export default {
    name:'Enviados',
    props:['data','type','remove'],
    methods:{
        open(msg,event){
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
        borrar(){
            var msg = [];
            document.getElementsByName('check').forEach(x =>{
                if(x.checked){
                    msg.push(parseInt(x.getAttribute('msg_id')));
                }
            });
            if(msg.length>0){
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
                    }else{
                        callError(res);
                    }
                })
                .catch(err =>{
                    catchAxios(err)
                })
            }
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
    .btn-picker{
        cursor: pointer;
        display: inline-block;
        user-select: none;
    }
    .btn-picker:hover{
        text-decoration: underline;
    }
</style>
