<template>
    <div class="mBorder" v-if='show'>
        <div class="mDiv">
            <div class="mHeader">
                <div class="gtitle">{{getTitle(type)}}</div>
                <div class="btn-close" @click='close'></div>
            </div>
            <div class="mBody">
                <ListaEdificios :close='close' :info='info' v-if='type==0'></ListaEdificios>
                <IslandResources :close='close' :data='info' v-else-if='type==2'></IslandResources>
            </div> 
            <div class="mFooter"></div>
        </div>
        <div class="mDiv2" v-if='type==2'>
            <div class="mHeader2">
                <div class="gtitle">{{getTitle(type)}}</div>
            </div>
            <div class="mBody">
                <IslandDonation :data='info' v-if='type==2'></IslandDonation>
            </div> 
            <div class="mFooter"></div>
        </div>
    </div>
</template>

<script>
    import ListaEdificios from 'Components/modal/ListaEdificios.vue';
    import IslandResources from 'Components/modal/IslandResources.vue';
    import IslandDonation from 'Components/modal/IslandDonation.vue';
    import axios from 'axios'
    import {catchAxios,callError} from 'Js/util.js'
    import interact from 'interactjs'
    import $modal from 'Stores/modal.js'

    export default {
        name: 'Modal',
        components: {
            ListaEdificios,
            IslandResources,
            IslandDonation
        },
        data(){
            return {
                show:false,
                type:null,
                info:{},
            }
        },
        methods:{
            open ({type,info}) {
                this.info = info;
                this.type = type;
                this.show = true;
            },
            getTitle(type){
                switch(type){
                    case 0:
                        return this.$t('building.title');
                    break;
                    case 2:
                        return this.$t('island.forest');
                    break;
                }
            },
            close(){
                this.show = false;
            },
            drag(){
                const position = { x: 0, y: 0 }
                interact('.mDiv')
                .draggable({
                    allowFrom:'.mHeader',
                    //inertia: true,
                    restrict: {
                        restriction: 'parent',
                    },
                    listeners: {
                        move (event) {
                            position.x += event.dx
                            position.y += event.dy
                            event.target.style.transform =`translate(${position.x}px, ${position.y}px)`
                        },
                    }
                })
            },
            drag2(){
                const position = { x: 0, y: 0 }
                interact('.mDiv2')
                .draggable({
                    allowFrom:'.mHeader2',
                    //inertia: true,
                    restrict: {
                        restriction: 'parent',
                    },
                    listeners: {
                        move (event) {
                            position.x += event.dx
                            position.y += event.dy
                            event.target.style.transform =`translate(${position.x}px, ${position.y}px)`
                        },
                    }
                })
            }
        },
        mounted(){
            this.drag();
            this.drag2();
            $modal.subscribe((action,state) => {
                if (action.type === "openModal") {
                    this.open(state);
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .mBorder{
        position: absolute;
        width: 90%;
        height: 90%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }
    .mDiv,.mDiv2{
        position: fixed;
        background: beige;
        z-index: 100;
        width: 720px;
        margin: auto;
        left: 0;
        right: 0;
        touch-action: none;
        margin-top: 120px; 
    }
    .mDiv2{
        width: 230px;
        left: -950px;
    }
    .mBody{
        overflow-y: auto;
        height: calc(100% - 26px);
        border-image: url('~Img/icon/bg_maincontentbox_left.png') 0% 50%;
        border-style: solid;
        border-width: 0px 3px;
        max-height: 75vh;
    }
    .mHeader,.mHeader2{
        cursor: grab;
        height: 26px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: auto;
        background-repeat: no-repeat;
        background-image: url('~Img/icon/modal_header.jpg');
        touch-action: none;
        user-select: none;
    }
    .mFooter{
        background-image: url('~Img/icon/bg_maincontentbox_footer.png');
        height:4px;
    }
    .btn-close{
        background-image: url('~Img/icon/close.png');
        height: 19px;
        width: 18px;
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
    }
    .btn-close:hover{
        background-image: url('~Img/icon/close-hover.png');
    }
    .mBody::-webkit-scrollbar-track
    {
        background-image: url('~Img/icon/scroll_bg.png');
    }
    .mBody::-webkit-scrollbar
    {
        width: 20px;
        background-color: #F5F5F5;
    }
    .mBody::-webkit-scrollbar-thumb
    {
        background-image: url('~Img/icon/scroll_mid.png');
    }
</style>