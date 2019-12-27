<template>
    <div class="mBorder">
        <Ventana1 :close='close' titulo="Consejero científico">
            <Investigaciones :category='category' :data_aux='info'></Investigaciones>
        </Ventana1>
        <Ventana2 titulo="Área de investigación">
            <Categorias :changeCategory='changeCategory'></Categorias>
        </Ventana2>
    </div>
</template>

<script>
import Ventana1 from 'Components/modal/Ventanas/Ventana1.vue'
import Ventana2 from 'Components/modal/Ventanas/Ventana2.vue'
import Categorias from 'Components/modal/Investigacion/Categorias.vue'
import Investigaciones from 'Components/modal/Investigacion/Investigaciones.vue'
import $config from 'Stores/config'

export default {
    name: 'Investigacion',
    props:['close'],
    components:{
        Ventana1,
        Ventana2,
        Categorias,
        Investigaciones
    },
    data(){
        return {
            category:1,
            info:{}
        }
    },
    computed:{
        research(){
            return $config.state.research;
        },
        user_research(){
            return $config.state.user_research;
        }
    },
    beforeMount(){
        this.info = {
            research: this.research,
            user_research: this.user_research
        }
    },
    methods:{
        changeCategory(category){
            this.category = category
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
</style>