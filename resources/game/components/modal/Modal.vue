<template>
    <div v-if='show'>
        <ListaEdificios :close='close' :info='info' v-if='type==0'></ListaEdificios>
        <Donaciones :close='close' :infop='info' v-else-if='type==2'></Donaciones>
    </div>
</template>

<script>
    import ListaEdificios from 'Components/modal/ListaEdificios.vue';
    import Donaciones from 'Components/modal/Donaciones/Donaciones.vue';
    import $modal from 'Stores/modal.js'

    export default {
        name: 'Modal',
        components: {
            ListaEdificios,
            Donaciones
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
            close(){
                this.show = false;
                this.info = {};
                this.type = null;
            },
        },
        mounted(){
            $modal.subscribe((action,state) => {
                if (action.type === "openModal") {
                    this.open(state);
                }
            });
        }
    }
</script>
