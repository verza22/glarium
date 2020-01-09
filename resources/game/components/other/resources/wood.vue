<template>
    <div class="d-inline-block" :title="$t('resources.wood')" v-if="cant>0||visible">
        <img :src="require('Img/icon/icon_wood.png')"> {{$money(cant)}}
    </div>
</template>

<script>
export default {
    name:'wood',
    props:{
        cant:Number,
        visible:{
            type:Boolean,
            default:false
        }
    }
}
</script>
