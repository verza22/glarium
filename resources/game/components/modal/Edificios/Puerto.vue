<template>
    <div class="box pt-2 pb-5">
        <div class="gtitle text-center">Velocidad de carga</div>
        <div>La velocidad de carga indica con qué rapidez se cargan y descargan los barcos mercantes.</div>
        <div class="d-flex justify-content-center mt-3">
            <div><img class="puerto" :src="require('Img/ciudad/16.png')"></div>
            <div>{{speed}} Bienes/minuto</div>
        </div>
        
        <div class="gtitle text-center mt-3">Comprar barco mercante</div>
        <div>Los barcos mercantes son el apoyo más importante de tu imperio, puesto que con estos barcos puedes transportar tus bienes y unidades.</div>
        <div class="d-flex justify-content-center">
            <div class="d-flex justify-content-center position-relative">
                <div class="mb-2"><img :src="require('Img/icon/ship_transport.png')"></div>
                <div class="valores">0/180</div>
            </div>
            <div class="d-flex align-items-center">
                <div>
                    <div class="text-center mb-2">Costos: <img :src="require('Img/icon/icon_gold.png')"> 1,326</div>
                    <div class="btnGeneral py-2 px-3">Comprar barco mercante</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $config from 'Stores/config'
export default {
    name: 'Puerto',
    props:['data'],
    computed:{
        speed(){
            return this.$floor(this.load_speed_base + (this.level * this.load_speed));
        },
        level(){
            return this.data.level - 1;
        },
        load_speed_base(){
            return $config.state.world.load_speed_base;
        },
        load_speed(){
            return $config.state.world.load_speed;
        }
    }
}
</script>

<style lang="scss" scoped>
    .box{font-size: 0.83rem;
    line-height: 0.83rem;}
    .puerto{
        width: 40px;
    }
</style>