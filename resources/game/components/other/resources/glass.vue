<template>
    <div class="d-inline-block" :title="$t('resources.glass')" v-if="cant>0||visible">
        <img :src="require('Img/icon/icon_glass.png')"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'glass',
    props:{
        cant:Number,
        visible:{
            type:Boolean,
            default:false
        }
    }
}
</script>
