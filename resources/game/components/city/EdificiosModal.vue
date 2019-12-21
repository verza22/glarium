<template>
    <div class="buildModal">
        
        <modal name="buildModal" class="py-5" :width="850" height="auto" :scrollable="true" @before-open="beforeOpen">
            <ListaEdificios :info='info' v-if='info.building==0'></ListaEdificios>
        </modal>
    </div>
    
</template>

<script>
    import ListaEdificios from 'Components/city/modal/ListaEdificios.vue';

    export default {
        name: 'EdificiosModal',
        components: {
            ListaEdificios
        },
        data(){
            return {
                info:{
                    city_id:null,
                    building:null,
                    position:null
                }
            }
        },
        methods:{
            beforeOpen (event) {
                this.info = {
                    building:event.params.building,
                    city_id:event.params.city_id,
                    position:event.params.position
                }
            }
        },
        mounted(){
        }
    }
</script>

<style lang="scss">
    .v--modal{
        background-color: #fdf7dd!important;
        padding: 15px 25px!important;
    }
</style>