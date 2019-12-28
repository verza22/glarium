<template>
    <div>
        <div class="mHeader2">
            <div class="gtitle">Acciones</div>
        </div>
        <div class="py-2">
            <div class="box-acciones">
                <div class="btn-accion" title="Diplomacia" @click='changeType(1)'>
                    <div class="btn-image btn-diplomacy"></div>
                    <div class="mt-1">Diplomacia</div>
                </div>
            </div>
            <div class="box-acciones">
                <div class="btn-accion" title="Transportar bienes">
                    <div class="btn-image btn-transport"></div>
                    <div class="mt-1">Transportar bienes</div>
                </div>
            </div>
            <div class="box-acciones">
                <div class="btn-accion" title="¡Defender ciudad!">
                    <div class="btn-image btn-defend inactive"></div>
                    <div class="mt-1">¡Defender ciudad!</div>
                </div>
            </div>
            <div class="box-acciones">
                <div class="btn-accion" title="¡Atacar ciudad!">
                    <div class="btn-image btn-attack inactive"></div>
                    <div class="mt-1">¡Atacar ciudad!</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Acciones',
    props:['changeType']
}
</script>

<style lang="scss" scoped>
    @import '~Sass/modal';
    .box-acciones{
        width: 49%;
        display: inline-block;
        text-align: center;
    }
    .btn-image{
        width: 50px;
        height: 34px;
        margin: auto;
    }
    .btn-accion:hover .btn-image{
        background-position-y: center;
    }
    .inactive{
        background-position-y: bottom!important;
    }
    .btn-transport{
        background-image: url('~Img/island/transport.jpg');
    }
    .btn-diplomacy{
        background-image: url('~Img/island/diplomacy.jpg');
    }
    .btn-defend{
        background-image: url('~Img/island/defend.jpg');
    }
    .btn-attack{
        background-image: url('~Img/island/attack.jpg');
    }
    .btn-accion{
        font-size: 0.7rem;
        line-height: 0.7rem;
        display: inline-block;
        padding: 8px;
        cursor: pointer;
    }
</style>