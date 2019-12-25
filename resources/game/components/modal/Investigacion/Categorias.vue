<template>
    <div class="box">
        <div class="mb-2">
            <div><img :src="require('Img/icon/area_seafaring.jpg')"></div>
        </div>
        <div class="mb-2">
            <div><img :src="require('Img/icon/area_economy.jpg')"></div>
        </div>
        <div class="mb-2">
            <div><img :src="require('Img/icon/area_knowledge.jpg')"></div>
        </div>
        <div class="mb-2">
            <div><img :src="require('Img/icon/area_military.jpg')"></div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Categorias'
}
</script>

<style lang="scss" scoped>
 .box{
    font-size: 0.83rem;
 }
</style>