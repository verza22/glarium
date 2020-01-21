<template>
    <div>
        <div class="gtitle text-center mb-3">Unidades programadas para entrenar</div>
        <div class="text-danger text-center">No se han seleccionado unidades</div>
        <hr class="hred">
        <div class="d-flex">
            <Recursos class="flex-1" :disabled='true' :unit='unitTotal'/>
            <div>asd</div>
        </div>
    </div>
</template>

<script>
import Recursos from 'Components/modal/Edificios/Cuartel/recursos.vue'

export default {
    name:'Entrenar',
    components:{
        Recursos
    },
    data(){
        return {
            unitTotal:{
                population:0,
                wood:0,
                wine:0,
                glass:0,
                sulfur:0,
                gold:0,
                time:0
            }
        }
    }
}
</script>
