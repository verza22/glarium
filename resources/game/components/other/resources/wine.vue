<template>
    <div class="d-inline-block" :title="$t('resources.wine')" v-if="cant>0||visible">
        <img :src="require('Img/icon/icon_wine.png')"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'wine',
    props:{
        cant:Number,
        visible:{
            type:Boolean,
            default:false
        }
    }
}
</script>
