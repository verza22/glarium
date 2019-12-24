<template>
    <div>
        <ListaEdificios :close='close' :info='info' v-if='type==0'></ListaEdificios>
        <Bosque :close='close' :infop='info' v-else-if='type==2'></Bosque>
    </div>
</template>

<script>
    import ListaEdificios from 'Components/modal/ListaEdificios.vue';
    import Bosque from 'Components/modal/Bosque/Bosque.vue';
    import $modal from 'Stores/modal.js'

    export default {
        name: 'Modal',
        components: {
            ListaEdificios,
            Bosque
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
