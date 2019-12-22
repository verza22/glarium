<template>
    <div class="box pb-5">
        <div class="text-justify mb-3 texto">{{$t('island.forestTitle')}}</div>
        <div class="gtitle text-center">{{$t('island.workers')}}</div>
        <div class="d-flex">
            <div class="flex-1 citizen">
                <img class="mb-2" :src="require('Img/island/citizen.png')">
                <div class="valores">0</div>
            </div>
            <div class="flex-3">Asignar</div>
            <div class="flex-1">Trabajadores</div>
        </div>
    </div>
</template>

<script>
export default {
    name:'IslandResources'
}
</script>

<style lang="scss" scoped>
    @import "~Sass/modal";
    .citizen{
        position: relative;
        display: flex;
        justify-content: center;
    }
</style>