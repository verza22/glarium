<template>
    <div class="box">
        <div class="mb-2 categoria">
            <div @click='changeCategory(1)'><img :src="require('Img/icon/area_seafaring.jpg')"></div>
        </div>
        <div class="mb-2 categoria">
            <div @click='changeCategory(2)'><img :src="require('Img/icon/area_economy.jpg')"></div>
        </div>
        <div class="mb-2 categoria">
            <div @click='changeCategory(3)'><img :src="require('Img/icon/area_knowledge.jpg')"></div>
        </div>
        <div class="mb-2 categoria">
            <div @click='changeCategory(4)'><img :src="require('Img/icon/area_military.jpg')"></div>
        </div>
    </div>
</template>

<script>
export default {
    name:'Categorias',
    props:['changeCategory']
}
</script>

<style lang="scss" scoped>
 .box{
    font-size: 0.83rem;
 }
 .categoria{
    cursor: pointer;
 }
</style>