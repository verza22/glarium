<template>
    <div>
        <div class="gtitle text-center">Aviso</div>
        <div class="my-2" v-if='corruption==0'>¡No hay nada que señalar! Enhorabuena, ¡todo en la ciudad está en orden!</div>
        <div class="my-2 d-flex" v-else>
            <div class="flex-1 text-center"><img :src="require('Img/icon/townhall_warning.png')"></div>
            <div class="flex-6">
                <div class="text-danger">En esta ciudad reina la corrupción.</div>
                <div class="text-justify">¡La productividad y la satisfacción en esta ciudad está claramente decayendo! Expande tu Residencia del Gobernador o palacio para disminuir la corrupción.</div>
            </div>
        </div>
    </div>
</template>

<script>
import $store from 'Stores/store'

export default {
    name:'Aviso',
    computed:{
        corruption(){
            return $store.getters.getCorruption;
        },
    }
}
</script>
