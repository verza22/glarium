<template>
    <div class="d-inline-block" :title="$t('resources.wood')" v-if="cant>0||visible||disabled">
        <img :src="require('Img/icon/icon_wood.png')" :class="disabled ? 'opacity-5' : ''"> {{$money(cant)}}
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
        },
        disabled:{
            type:Boolean,
            default:false
        }
    }
}
</script>
