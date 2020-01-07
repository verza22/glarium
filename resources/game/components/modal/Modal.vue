<template>
    <div v-if='show'>
        <ListaEdificios :close='close' :info='info' v-if='type==0'></ListaEdificios>
        <Edificios :close='close' :info='info' v-else-if='type==1'></Edificios>
        <Donaciones :close='close' :infop='info' v-else-if='type==2'></Donaciones>
        <Investigacion :close='close' :info='info' v-else-if='type==3'></Investigacion>
        <IslaCiudad :close='close' :info='info' v-else-if='type==4'></IslaCiudad>
        <Mensajes :close='close' :info='info' v-else-if='type==5'></Mensajes>
        <Colonize :close='close' :info='info' v-else-if='type==6'></Colonize>
        <General :close='close' :info='info' v-else-if='type==7'></General>
        <Mayor :close='close' :info='info' v-else-if='type==8'></Mayor>
    </div>
</template>

<script>
    import ListaEdificios from 'Components/modal/ListaEdificios.vue'
    import Donaciones from 'Components/modal/Donaciones/Donaciones.vue'
    import Edificios from 'Components/modal/Edificios/Edificios.vue'
    import Investigacion from 'Components/modal/Investigacion/Investigacion.vue'
    import IslaCiudad from 'Components/modal/IslaCiudad/IslaCiudad.vue'
    import Mensajes from 'Components/modal/Mensajes/Mensajes.vue'
    import Colonize from 'Components/modal/IslaCiudad/Opciones/Colonize.vue'
    import General from 'Components/modal/General/General.vue'
    import Mayor from 'Components/modal/Mayor/Mayor.vue'
    import $modal from 'Stores/modal.js'

    export default {
        name: 'Modal',
        components: {
            ListaEdificios,
            Donaciones,
            Edificios,
            Investigacion,
            IslaCiudad,
            Mensajes,
            Colonize,
            General,
            Mayor
        },
        data(){
            return {
                show:false,
                type:null,
                info:{}
            }
        },
        methods:{
            open ({type,info}) {
                this.info = info;
                this.type = type;
                this.show = true;
            },
            update ({type,info}) {
                if(this.show && this.type == type && this.info.building_id == info.building_id){
                    this.info = info;
                }
            },
            changeRoute(){
                if(!(this.type==3||this.type==5)){
                    this.close();
                }
            },
            close(){
                this.show = false;
                this.info = {};
                this.type = null;
                $modal.commit('clear');
            },
        },
        mounted(){
            $modal.subscribe((action,state) => {
                if (action.type === "openModal") {
                    this.open(state);
                }else if(action.type === "updateModal"){
                    this.update(state);
                }else if(action.type === "changeRoute"){
                    this.changeRoute();
                }
            });
        }
    }
</script>
